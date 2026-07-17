import { db } from "@/lib/db";

export async function getScoutsByTroop(troopId: string) {
  return db.scout.findMany({
    where: { troopId },
    orderBy: { lastName: "asc" },
  });
}

export async function getAllScoutsForMap(troopIds?: string[]) {
  return db.scout.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null },
      ...(troopIds ? { troopId: { in: troopIds } } : {}),
    },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      troop: {
        select: { troopNumber: true },
      },
    },
  });
}
