import { db } from "@/lib/db";

export async function getDashboardStats() {
  const [troopCount, scoutCount, boothCount, geocodedScouts, geocodedBooths] =
    await Promise.all([
      db.troop.count(),
      db.scout.count(),
      db.booth.count(),
      db.scout.count({
        where: { latitude: { not: null }, longitude: { not: null } },
      }),
      db.booth.count({
        where: { latitude: { not: null }, longitude: { not: null } },
      }),
    ]);

  const troops = await db.troop.findMany({
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
