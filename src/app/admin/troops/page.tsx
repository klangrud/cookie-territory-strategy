import { getAllTroops, getTroopsByIds } from "@/lib/queries/troop.queries";
import { createTroop } from "@/lib/actions/troop.actions";
import { requireAccessScope } from "@/lib/authz";
import { TroopsTable } from "@/components/admin/troops-table";

export default async function TroopsPage() {
  const scope = await requireAccessScope();
  const troops = scope.isSuperAdmin
    ? await getAllTroops()
    : await getTroopsByIds(scope.viewableTroopIds);

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-900">Troops</h1>
      {!scope.isSuperAdmin && (
        <p className="mt-2 text-sm text-gray-500">
          Showing troops you manage. Add a new troop below to start managing
          it — you&apos;ll automatically become its leader.
        </p>
      )}

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

      <TroopsTable
        troops={troops}
        isSuperAdmin={scope.isSuperAdmin}
        editableTroopIds={scope.editableTroopIds}
      />
    </div>
  );
}
