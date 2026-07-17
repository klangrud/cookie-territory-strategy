import { db } from "@/lib/db";

export async function getAllUsersWithMemberships() {
  return db.user.findMany({
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isSuperAdmin: true,
      troopMemberships: {
        select: {
          id: true,
          role: true,
          troop: { select: { id: true, troopNumber: true, name: true } },
        },
      },
    },
  });
}
