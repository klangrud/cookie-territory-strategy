"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  createTroopSchema,
  updateTroopSchema,
} from "@/lib/validators/troop.validators";

export async function createTroop(formData: FormData) {
  const parsed = createTroopSchema.safeParse({
    troopNumber: formData.get("troopNumber"),
    name: formData.get("name"),
    description: formData.get("description"),
    serviceUnitArea: formData.get("serviceUnitArea"),
  });

  if (!parsed.success) {
    throw new Error(
      Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
    );
  }

  await db.troop.create({
    data: {
      troopNumber: parsed.data.troopNumber,
      name: parsed.data.name || null,
      description: parsed.data.description || null,
      serviceUnitArea: parsed.data.serviceUnitArea || null,
    },
  });

  revalidatePath("/admin/troops");
}

export async function updateTroop(formData: FormData) {
  const parsed = updateTroopSchema.safeParse({
    id: formData.get("id"),
    troopNumber: formData.get("troopNumber"),
    name: formData.get("name"),
    description: formData.get("description"),
    serviceUnitArea: formData.get("serviceUnitArea"),
  });

  if (!parsed.success) {
    throw new Error(
      Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
    );
  }

  await db.troop.update({
    where: { id: parsed.data.id },
    data: {
      troopNumber: parsed.data.troopNumber,
      name: parsed.data.name || null,
      description: parsed.data.description || null,
      serviceUnitArea: parsed.data.serviceUnitArea || null,
    },
  });

  revalidatePath("/admin/troops");
}

export async function deleteTroop(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("ID is required");

  await db.troop.delete({ where: { id } });
  revalidatePath("/admin/troops");
}
