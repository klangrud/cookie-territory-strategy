import { getAllTroops } from "@/lib/queries/troop.queries";
import { createTroop, deleteTroop } from "@/lib/actions/troop.actions";

export default async function TroopsPage() {
  const troops = await getAllTroops();

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-900">Troops</h1>

      <form action={createTroop} className="mt-6 rounded border bg-green-50 p-4">
        <h2 className="mb-3 text-sm font-semibold text-green-900">Add Troop</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Troop Number *
            </label>
            <input
              name="troopNumber"
              required
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Name
            </label>
            <input
              name="name"
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Description
            </label>
            <input
              name="description"
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Service Unit Area
            </label>
            <input
              name="serviceUnitArea"
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-3 rounded bg-green-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Troop
        </button>
      </form>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b text-green-800">
            <th className="pb-2">Troop #</th>
            <th className="pb-2">Name</th>
            <th className="pb-2">Service Unit</th>
            <th className="pb-2 text-right">Scouts</th>
            <th className="pb-2 text-right">Booths</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {troops.map((troop) => (
            <tr key={troop.id} className="border-b">
              <td className="py-2 font-medium">{troop.troopNumber}</td>
              <td className="py-2">{troop.name || "—"}</td>
              <td className="py-2">{troop.serviceUnitArea || "—"}</td>
              <td className="py-2 text-right">{troop._count.scouts}</td>
              <td className="py-2 text-right">{troop._count.booths}</td>
              <td className="py-2 text-right">
                <form action={deleteTroop} className="inline">
                  <input type="hidden" name="id" value={troop.id} />
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
        </tbody>
      </table>
    </div>
  );
}
