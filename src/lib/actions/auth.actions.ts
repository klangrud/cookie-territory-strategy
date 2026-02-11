"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!parsed.success) {
    throw new Error(
      Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
    );
  }

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    throw new Error("Email already in use");
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await db.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
    },
  });

  redirect("/login");
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return {
      error: Object.values(parsed.error.flatten().fieldErrors).flat().join(", "),
    };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const isValid = await compare(parsed.data.currentPassword, user.passwordHash);
  if (!isValid) {
    return { error: "Current password is incorrect" };
  }

  const passwordHash = await hash(parsed.data.newPassword, 12);
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { success: true };
}
