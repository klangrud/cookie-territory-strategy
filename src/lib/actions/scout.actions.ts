"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { geocodeAddress } from "@/lib/geocode";
import { requireActionScope, assertCanEditTroop } from "@/lib/authz";
import {
  createScoutSchema,
  updateScoutSchema,
} from "@/lib/validators/scout.validators";

export async function createScout(formData: FormData) {
  const parsed = createScoutSchema.safeParse({
    troopId: formData.get("troopId"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
  });

  if (!parsed.success) {
    throw new Error(
      Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
    );
  }

  const scope = await requireActionScope();
  assertCanEditTroop(scope, parsed.data.troopId);

  const scout = await db.scout.create({ data: parsed.data });

  const coords = await geocodeAddress(
    parsed.data.street,
    parsed.data.city,
    parsed.data.state,
    parsed.data.zip
  );

  if (coords) {
    await db.scout.update({
      where: { id: scout.id },
      data: coords,
    });
  }

  revalidatePath(`/admin/scouts/${parsed.data.troopId}`);
}

export async function updateScout(formData: FormData) {
  const parsed = updateScoutSchema.safeParse({
    id: formData.get("id"),
    troopId: formData.get("troopId"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
  });

  if (!parsed.success) {
    throw new Error(
      Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
    );
  }

  const existing = await db.scout.findUnique({
    where: { id: parsed.data.id },
  });
  if (!existing) throw new Error("Scout not found");

  const scope = await requireActionScope();
  assertCanEditTroop(scope, existing.troopId);
  assertCanEditTroop(scope, parsed.data.troopId);

  const addressChanged =
    existing &&
    (existing.street !== parsed.data.street ||
      existing.city !== parsed.data.city ||
      existing.state !== parsed.data.state ||
      existing.zip !== parsed.data.zip);

  const updateData: Record<string, unknown> = { ...parsed.data };
  delete updateData.id;

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

  await db.scout.update({
    where: { id: parsed.data.id },
    data: updateData,
  });

  revalidatePath(`/admin/scouts/${parsed.data.troopId}`);
}

export async function deleteScout(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("ID is required");

  const existing = await db.scout.findUnique({ where: { id } });
  if (!existing) throw new Error("Scout not found");

  const scope = await requireActionScope();
  assertCanEditTroop(scope, existing.troopId);

  await db.scout.delete({ where: { id } });
  revalidatePath(`/admin/scouts/${existing.troopId}`);
}
