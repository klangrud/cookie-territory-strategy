import { db } from "@/lib/db";

export async function getBoothsByTroop(troopId: string) {
  return db.booth.findMany({
    where: { troopId },
    orderBy: { date: "asc" },
  });
}

export async function getAllBoothsForMap(dateFrom?: Date, dateTo?: Date) {
  const where: Record<string, unknown> = {
    latitude: { not: null },
    longitude: { not: null },
  };

  if (dateFrom || dateTo) {
    const dateFilter: Record<string, Date> = {};
    if (dateFrom) dateFilter.gte = dateFrom;
    if (dateTo) dateFilter.lte = dateTo;
    where.date = dateFilter;
  }

  return db.booth.findMany({
    where,
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      date: true,
      startTime: true,
      endTime: true,
      boothType: true,
      troop: {
        select: { troopNumber: true },
      },
    },
  });
}
