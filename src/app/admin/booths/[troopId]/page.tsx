import { notFound } from "next/navigation";
import { getTroopById } from "@/lib/queries/troop.queries";
import { getBoothsByTroop } from "@/lib/queries/booth.queries";
import { BoothManager } from "@/components/admin/booth-manager";
import { requireAccessScope, canViewTroop, canEditTroop } from "@/lib/authz";

export default async function TroopBoothsPage({
  params,
}: {
  params: Promise<{ troopId: string }>;
}) {
  const { troopId } = await params;
  const troop = await getTroopById(troopId);
  if (!troop) notFound();

  const scope = await requireAccessScope();
  if (!canViewTroop(scope, troopId)) notFound();
  const canEdit = canEditTroop(scope, troopId);

  const booths = await getBoothsByTroop(troopId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-900">
        Booths — Troop {troop.troopNumber}
      </h1>

      <BoothManager troopId={troopId} booths={booths} canEdit={canEdit} />
    </div>
  );
}
