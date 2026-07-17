import { auth } from "@/lib/auth";
import { getAllScoutsForMap } from "@/lib/queries/scout.queries";
import { getAllBoothsForMap } from "@/lib/queries/booth.queries";
import { TerritoryMap } from "@/components/map/territory-map";
import { buildTroopColorMap } from "@/lib/troop-colors";
import { getAccessScope } from "@/lib/authz";

export default async function HomePage() {
  const session = await auth();
  const scope = session?.user?.id ? await getAccessScope(session.user.id) : null;
  const [scouts, booths] = await Promise.all([
    scope
      ? getAllScoutsForMap(scope.isSuperAdmin ? undefined : scope.viewableTroopIds)
      : Promise.resolve([]),
    getAllBoothsForMap(),
  ]);

  // Collect unique troop numbers and build color assignments
  const troopNumberSet = new Set<string>();
  scouts.forEach((s) => troopNumberSet.add(s.troop.troopNumber));
  booths.forEach((b) => troopNumberSet.add(b.troop.troopNumber));
  const colorMap = buildTroopColorMap([...troopNumberSet]);

  const troopColors = [...colorMap.entries()].map(
    ([troopNumber, color]) => ({ troopNumber, color })
  );

  // Serialize for client component
  const scoutPins = scouts.map((s) => ({
    id: s.id,
    latitude: s.latitude!,
    longitude: s.longitude!,
    troop: { troopNumber: s.troop.troopNumber },
  }));

  const boothPins = booths.map((b) => ({
    id: b.id,
    name: b.name,
    latitude: b.latitude!,
    longitude: b.longitude!,
    date: b.date.toISOString(),
    startTime: b.startTime,
    endTime: b.endTime,
    boothType: b.boothType,
    troop: { troopNumber: b.troop.troopNumber },
  }));

  // Map ID for AdvancedMarker — user should create at Google Cloud Console
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "DEMO_MAP_ID";

  return (
    <TerritoryMap
      scouts={scoutPins}
      booths={boothPins}
      troopColors={troopColors}
      mapId={mapId}
    />
  );
}
