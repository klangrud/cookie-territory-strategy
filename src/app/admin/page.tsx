import { getDashboardStats } from "@/lib/queries/analytics.queries";
import { requireAccessScope } from "@/lib/authz";

export default async function AdminDashboardPage() {
  const scope = await requireAccessScope();
  const stats = await getDashboardStats(
    scope.isSuperAdmin ? undefined : scope.viewableTroopIds
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-900">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-t-4 border-green-700 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Troops</p>
          <p className="text-3xl font-bold">{stats.troopCount}</p>
        </div>
        <div className="rounded-lg border border-t-4 border-green-700 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Scouts</p>
          <p className="text-3xl font-bold">{stats.scoutCount}</p>
          <p className="text-xs text-gray-400">
            {stats.scoutGeoRate}% geocoded
          </p>
        </div>
        <div className="rounded-lg border border-t-4 border-green-700 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Booths</p>
          <p className="text-3xl font-bold">{stats.boothCount}</p>
          <p className="text-xs text-gray-400">
            {stats.boothGeoRate}% geocoded
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-green-900">Troop Breakdown</h2>
      <table className="mt-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b text-green-800">
            <th className="pb-2">Troop #</th>
            <th className="pb-2">Name</th>
            <th className="pb-2">Service Unit</th>
            <th className="pb-2 text-right">Scouts</th>
            <th className="pb-2 text-right">Booths</th>
          </tr>
        </thead>
        <tbody>
          {stats.troops.map((troop) => (
            <tr key={troop.id} className="border-b">
              <td className="py-2 font-medium">{troop.troopNumber}</td>
              <td className="py-2">{troop.name || "—"}</td>
              <td className="py-2">{troop.serviceUnitArea || "—"}</td>
              <td className="py-2 text-right">{troop._count.scouts}</td>
              <td className="py-2 text-right">{troop._count.booths}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
