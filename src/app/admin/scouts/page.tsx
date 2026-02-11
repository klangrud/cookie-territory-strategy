import Link from "next/link";
import { getAllTroops } from "@/lib/queries/troop.queries";

export default async function ScoutsIndexPage() {
  const troops = await getAllTroops();

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-900">Scouts</h1>
      <p className="mt-2 text-sm text-gray-500">
        Select a troop to manage its scouts.
      </p>

      <div className="mt-6 space-y-2">
        {troops.map((troop) => (
          <Link
            key={troop.id}
            href={`/admin/scouts/${troop.id}`}
            className="block rounded border p-3 hover:bg-gray-50"
          >
            <span className="font-medium">Troop {troop.troopNumber}</span>
            {troop.name && (
              <span className="ml-2 text-sm text-gray-500">{troop.name}</span>
            )}
            <span className="ml-auto float-right text-sm text-gray-400">
              {troop._count.scouts} scouts
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
