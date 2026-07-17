"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createMembershipSchema } from "@/lib/validators/membership.validators";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    throw new Error("Only a superadmin can manage troop memberships.");
  }
}

export async function createMembership(formData: FormData) {
  await requireSuperAdmin();

  const parsed = createMembershipSchema.safeParse({
    userId: formData.get("userId"),
    troopId: formData.get("troopId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    throw new Error(
      Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
    );
  }

  await db.troopMembership.upsert({
    where: {
      userId_troopId: {
        userId: parsed.data.userId,
        troopId: parsed.data.troopId,
      },
    },
    update: { role: parsed.data.role },
    create: parsed.data,
  });

  revalidatePath("/admin/users");
}

export async function deleteMembership(formData: FormData) {
  await requireSuperAdmin();

  const id = formData.get("id") as string;
  if (!id) throw new Error("ID is required");

  await db.troopMembership.delete({ where: { id } });
  revalidatePath("/admin/users");
}
