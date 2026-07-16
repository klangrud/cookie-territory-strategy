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

export async function getBoothsFiltered(filters: {
  troopNumber?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  const where: Record<string, unknown> = {};

  if (filters.troopNumber) {
    where.troop = { troopNumber: filters.troopNumber };
  }

  if (filters.dateFrom || filters.dateTo) {
    const dateFilter: Record<string, Date> = {};
    if (filters.dateFrom) dateFilter.gte = filters.dateFrom;
    if (filters.dateTo) dateFilter.lte = filters.dateTo;
    where.date = dateFilter;
  }

  return db.booth.findMany({
    where,
    orderBy: { date: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      street: true,
      city: true,
      state: true,
      zip: true,
      date: true,
      startTime: true,
      endTime: true,
      boothType: true,
      latitude: true,
      longitude: true,
      troop: { select: { troopNumber: true, name: true } },
    },
  });
}

export async function getUngeocodedBooths() {
  return db.booth.findMany({
    where: {
      OR: [{ latitude: null }, { longitude: null }],
    },
    select: {
      id: true,
      name: true,
      street: true,
      city: true,
      state: true,
      zip: true,
      troop: { select: { troopNumber: true } },
    },
  });
}
