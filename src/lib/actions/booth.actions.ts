"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { geocodeAddress } from "@/lib/geocode";
import {
  createBoothSchema,
  updateBoothSchema,
} from "@/lib/validators/booth.validators";

export async function createBooth(formData: FormData) {
  const parsed = createBoothSchema.safeParse({
    troopId: formData.get("troopId"),
    name: formData.get("name"),
    description: formData.get("description"),
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    boothType: formData.get("boothType"),
  });

  if (!parsed.success) {
    throw new Error(
      Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
    );
  }

  const sourceBoothId = formData.get("sourceBoothId") as string | null;

  let coords: { latitude: number; longitude: number } | null = null;

  if (sourceBoothId) {
    const source = await db.booth.findUnique({
      where: { id: sourceBoothId },
      select: { street: true, city: true, state: true, zip: true, latitude: true, longitude: true },
    });

    const addressMatch =
      source &&
      source.street === parsed.data.street &&
      source.city === parsed.data.city &&
      source.state === parsed.data.state &&
      source.zip === parsed.data.zip;

    if (addressMatch && source.latitude != null && source.longitude != null) {
      coords = { latitude: source.latitude, longitude: source.longitude };
    }
  }

  if (!coords) {
    coords = await geocodeAddress(
      parsed.data.street,
      parsed.data.city,
      parsed.data.state,
      parsed.data.zip
    );
  }

  await db.booth.create({
    data: {
      ...parsed.data,
      description: parsed.data.description || null,
      ...(coords && coords),
    },
  });

  revalidatePath(`/admin/booths/${parsed.data.troopId}`);
}

export async function updateBooth(formData: FormData) {
  const parsed = updateBoothSchema.safeParse({
    id: formData.get("id"),
    troopId: formData.get("troopId"),
    name: formData.get("name"),
    description: formData.get("description"),
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    boothType: formData.get("boothType"),
  });

  if (!parsed.success) {
    throw new Error(
      Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
    );
  }

  const existing = await db.booth.findUnique({
    where: { id: parsed.data.id },
  });

  const addressChanged =
    existing &&
    (existing.street !== parsed.data.street ||
      existing.city !== parsed.data.city ||
      existing.state !== parsed.data.state ||
      existing.zip !== parsed.data.zip);

  const updateData: Record<string, unknown> = { ...parsed.data };
  delete updateData.id;
  updateData.description = parsed.data.description || null;

  if (addressChanged) {
    const coords = await geocodeAddress(
      parsed.data.street,
      parsed.data.city,
      parsed.data.state,
      parsed.data.zip
    );
    if (coords) {
      updateData.latitude = coords.latitude;
      updateData.longitude = coords.longitude;
    }
  }

  await db.booth.update({
    where: { id: parsed.data.id },
    data: updateData,
  });

  revalidatePath(`/admin/booths/${parsed.data.troopId}`);
}

export async function deleteBooth(formData: FormData) {
  const id = formData.get("id") as string;
  const troopId = formData.get("troopId") as string;
  if (!id) throw new Error("ID is required");

  await db.booth.delete({ where: { id } });
  revalidatePath(`/admin/booths/${troopId}`);
}
