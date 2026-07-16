import { db } from "@/lib/db";

export async function getAllTroops() {
  return db.troop.findMany({
    orderBy: { troopNumber: "asc" },
    include: {
      _count: { select: { scouts: true, booths: true } },
    },
  });
}

export async function getTroopById(id: string) {
  return db.troop.findUnique({ where: { id } });
}

export async function getTroopByNumber(troopNumber: string) {
  return db.troop.findUnique({
    where: { troopNumber },
    include: {
      _count: { select: { scouts: true, booths: true } },
    },
  });
}
