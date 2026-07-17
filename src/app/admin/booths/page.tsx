import Link from "next/link";
import { getAllTroops, getTroopsByIds } from "@/lib/queries/troop.queries";
import { requireAccessScope } from "@/lib/authz";

export default async function BoothsIndexPage() {
  const scope = await requireAccessScope();
  const troops = scope.isSuperAdmin
    ? await getAllTroops()
    : await getTroopsByIds(scope.viewableTroopIds);

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-900">Booths</h1>
      <p className="mt-2 text-sm text-gray-500">
        Select a troop to manage its booth locations.
      </p>

      <div className="mt-6 space-y-2">
        {troops.map((troop) => (
          <Link
            key={troop.id}
            href={`/admin/booths/${troop.id}`}
            className="block rounded border p-3 hover:bg-gray-50"
          >
            <span className="font-medium">Troop {troop.troopNumber}</span>
            {troop.name && (
              <span className="ml-2 text-sm text-gray-500">{troop.name}</span>
            )}
            <span className="ml-auto float-right text-sm text-gray-400">
              {troop._count.booths} booths
            </span>
          </Link>
        ))}

        {troops.length === 0 && (
          <p className="text-sm text-gray-400">
            No troops yet.{" "}
            <Link href="/admin/troops" className="text-green-700 hover:underline">
              Add one first.
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
