"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireActionScope, assertCanEditTroop } from "@/lib/authz";
import {
  createTroopSchema,
  updateTroopSchema,
} from "@/lib/validators/troop.validators";

export async function createTroop(formData: FormData) {
  const scope = await requireActionScope();

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

  const troop = await db.troop.create({
    data: {
      troopNumber: parsed.data.troopNumber,
      name: parsed.data.name || null,
      description: parsed.data.description || null,
      serviceUnitArea: parsed.data.serviceUnitArea || null,
    },
  });

  // Whoever creates a troop becomes its leader — self-service, no
  // superadmin hand-off required. Superadmins already have full access,
  // so they don't need a membership row of their own.
  if (!scope.isSuperAdmin) {
    await db.troopMembership.create({
      data: { userId: scope.userId, troopId: troop.id, role: "LEADER" },
    });
  }

  revalidatePath("/admin/troops");
}

export async function updateTroop(formData: FormData) {
  const scope = await requireActionScope();

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

  assertCanEditTroop(scope, parsed.data.id);

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
  const scope = await requireActionScope();

  const id = formData.get("id") as string;
  if (!id) throw new Error("ID is required");

  assertCanEditTroop(scope, id);

  await db.troop.delete({ where: { id } });
  revalidatePath("/admin/troops");
}
