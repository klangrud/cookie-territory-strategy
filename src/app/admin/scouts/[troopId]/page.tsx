import { notFound } from "next/navigation";
import { getTroopById } from "@/lib/queries/troop.queries";
import { getScoutsByTroop } from "@/lib/queries/scout.queries";
import { createScout, deleteScout } from "@/lib/actions/scout.actions";

export default async function TroopScoutsPage({
  params,
}: {
  params: Promise<{ troopId: string }>;
}) {
  const { troopId } = await params;
  const troop = await getTroopById(troopId);
  if (!troop) notFound();

  const scouts = await getScoutsByTroop(troopId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-900">
        Scouts — Troop {troop.troopNumber}
      </h1>

      <form action={createScout} className="mt-6 rounded border bg-green-50 p-4">
        <h2 className="mb-3 text-sm font-semibold text-green-900">Add Scout</h2>
        <input type="hidden" name="troopId" value={troopId} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              First Name *
            </label>
            <input
              name="firstName"
              required
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Last Name *
            </label>
            <input
              name="lastName"
              required
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600">
              Street *
            </label>
            <input
              name="street"
              required
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              City *
            </label>
            <input
              name="city"
              required
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              State *
            </label>
            <input
              name="state"
              required
              maxLength={2}
              placeholder="IL"
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              ZIP *
            </label>
            <input
              name="zip"
              required
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-3 rounded bg-green-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Scout
        </button>
      </form>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b text-green-800">
            <th className="pb-2">Name</th>
            <th className="pb-2">Address</th>
            <th className="pb-2 text-center">Geocoded</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {scouts.map((scout) => (
            <tr key={scout.id} className="border-b">
              <td className="py-2 font-medium">
                {scout.firstName} {scout.lastName}
              </td>
              <td className="py-2 text-gray-600">
                {scout.street}, {scout.city}, {scout.state} {scout.zip}
              </td>
              <td className="py-2 text-center">
                {scout.latitude && scout.longitude ? (
                  <span className="text-green-600" title={`${scout.latitude}, ${scout.longitude}`}>
                    ✓
                  </span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
              </td>
              <td className="py-2 text-right">
                <form action={deleteScout} className="inline">
                  <input type="hidden" name="id" value={scout.id} />
                  <input type="hidden" name="troopId" value={troopId} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}

          {scouts.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-center text-sm text-gray-400">
                No scouts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
