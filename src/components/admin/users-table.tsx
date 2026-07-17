"use client";

import { useMemo, useState } from "react";
import { RemoveMembershipButton } from "@/components/admin/remove-membership-button";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperAdmin: boolean;
  troopMemberships: {
    id: string;
    role: "LEADER" | "REGIONAL";
    troop: { id: string; troopNumber: string; name: string | null };
  }[];
}

interface UsersTableProps {
  users: User[];
}

type SortField = "name" | "email" | "isSuperAdmin";
type SortDir = "asc" | "desc";

function sortValue(user: User, field: SortField): string | number {
  switch (field) {
    case "name":
      return `${user.firstName} ${user.lastName}`;
    case "email":
      return user.email;
    case "isSuperAdmin":
      return user.isSuperAdmin ? 1 : 0;
  }
}

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const visibleUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? users.filter((u) =>
          [`${u.firstName} ${u.lastName}`, u.email].some((field) =>
            field.toLowerCase().includes(q)
          )
        )
      : users;

    return [...filtered].sort((a, b) => {
      const av = sortValue(a, sortField);
      const bv = sortValue(b, sortField);
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [users, search, sortField, sortDir]);

  function sortIndicator(field: SortField) {
    if (field !== sortField) return null;
    return sortDir === "asc" ? " ▲" : " ▼";
  }

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name or email..."
        className="mt-6 w-full max-w-sm rounded border px-3 py-1.5 text-sm"
      />

      <table className="mt-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b text-green-800">
            <th className="cursor-pointer select-none pb-2" onClick={() => toggleSort("name")}>
              User{sortIndicator("name")}
            </th>
            <th
              className="cursor-pointer select-none pb-2"
              onClick={() => toggleSort("isSuperAdmin")}
            >
              Superadmin{sortIndicator("isSuperAdmin")}
            </th>
            <th className="pb-2">Memberships</th>
          </tr>
        </thead>
        <tbody>
          {visibleUsers.map((user) => (
            <tr key={user.id} className="border-b align-top">
              <td className="py-2 font-medium">
                {user.firstName} {user.lastName}
                <div className="text-xs font-normal text-gray-500">
                  {user.email}
                </div>
              </td>
              <td className="py-2">{user.isSuperAdmin ? "Yes" : "—"}</td>
              <td className="py-2">
                {user.troopMemberships.length === 0 && (
                  <span className="text-gray-400">No troops assigned</span>
                )}
                <ul className="space-y-1">
                  {user.troopMemberships.map((m) => (
                    <li key={m.id} className="flex items-center gap-2">
                      <span>
                        Troop {m.troop.troopNumber}
                        {m.troop.name ? ` — ${m.troop.name}` : ""} (
                        {m.role === "LEADER" ? "Leader" : "Regional"})
                      </span>
                      <RemoveMembershipButton
                        membershipId={m.id}
                        troopLabel={`Troop ${m.troop.troopNumber}`}
                      />
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}

          {visibleUsers.length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 text-center text-sm text-gray-400">
                No users match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
