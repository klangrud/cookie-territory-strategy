import { redirect } from "next/navigation";
import { requireAccessScope } from "@/lib/authz";
import { getAllUsersWithMemberships } from "@/lib/queries/user.queries";
import { getAllTroops } from "@/lib/queries/troop.queries";
import { createMembership } from "@/lib/actions/membership.actions";
import { UsersTable } from "@/components/admin/users-table";

export default async function UsersPage() {
  const scope = await requireAccessScope();
  if (!scope.isSuperAdmin) redirect("/admin");

  const [users, troops] = await Promise.all([
    getAllUsersWithMemberships(),
    getAllTroops(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-900">Users</h1>
      <p className="mt-2 text-sm text-gray-500">
        Assign troop leaders and regional leaders. A LEADER can manage their
        troop&apos;s scouts and booths; a REGIONAL leader gets read-only
        visibility across their troops.
      </p>

      <form
        action={createMembership}
        className="mt-6 rounded border bg-green-50 p-4"
      >
        <h2 className="mb-3 text-sm font-semibold text-green-900">
          Add Membership
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              User *
            </label>
            <select
              name="userId"
              required
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Troop *
            </label>
            <select
              name="troopId"
              required
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            >
              {troops.map((troop) => (
                <option key={troop.id} value={troop.id}>
                  Troop {troop.troopNumber}
                  {troop.name ? ` — ${troop.name}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Role *
            </label>
            <select
              name="role"
              required
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            >
              <option value="LEADER">Leader</option>
              <option value="REGIONAL">Regional</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-3 rounded bg-green-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Membership
        </button>
      </form>

      <UsersTable users={users} />
    </div>
  );
}
