import { db } from "@/lib/db";

export async function getDashboardStats(troopIds?: string[]) {
  const troopFilter = troopIds ? { id: { in: troopIds } } : {};
  const scoutFilter = troopIds ? { troopId: { in: troopIds } } : {};
  const boothFilter = troopIds ? { troopId: { in: troopIds } } : {};

  const [troopCount, scoutCount, boothCount, geocodedScouts, geocodedBooths] =
    await Promise.all([
      db.troop.count({ where: troopFilter }),
      db.scout.count({ where: scoutFilter }),
      db.booth.count({ where: boothFilter }),
      db.scout.count({
        where: { ...scoutFilter, latitude: { not: null }, longitude: { not: null } },
      }),
      db.booth.count({
        where: { ...boothFilter, latitude: { not: null }, longitude: { not: null } },
      }),
    ]);

  const troops = await db.troop.findMany({
    where: troopFilter,
    orderBy: { troopNumber: "asc" },
    include: {
      _count: { select: { scouts: true, booths: true } },
    },
  });

  return {
    troopCount,
    scoutCount,
    boothCount,
    geocodedScouts,
    geocodedBooths,
    scoutGeoRate: scoutCount > 0 ? Math.round((geocodedScouts / scoutCount) * 100) : 0,
    boothGeoRate: boothCount > 0 ? Math.round((geocodedBooths / boothCount) * 100) : 0,
    troops,
  };
}
