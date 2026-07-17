"use client";

import { useMemo, useState } from "react";
import { TroopRow } from "@/components/admin/troop-row";

interface Troop {
  id: string;
  troopNumber: string;
  name: string | null;
  description: string | null;
  serviceUnitArea: string | null;
  _count: { scouts: number; booths: number };
}

interface TroopsTableProps {
  troops: Troop[];
  isSuperAdmin: boolean;
  editableTroopIds: string[];
}

type SortField = "troopNumber" | "name" | "serviceUnitArea" | "scouts" | "booths";
type SortDir = "asc" | "desc";

function sortValue(troop: Troop, field: SortField): string | number {
  switch (field) {
    case "troopNumber":
      return troop.troopNumber;
    case "name":
      return troop.name ?? "";
    case "serviceUnitArea":
      return troop.serviceUnitArea ?? "";
    case "scouts":
      return troop._count.scouts;
    case "booths":
      return troop._count.booths;
  }
}

export function TroopsTable({ troops, isSuperAdmin, editableTroopIds }: TroopsTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("troopNumber");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const visibleTroops = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? troops.filter((t) =>
          [t.troopNumber, t.name, t.serviceUnitArea]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(q))
        )
      : troops;

    const sorted = [...filtered].sort((a, b) => {
      const av = sortValue(a, sortField);
      const bv = sortValue(b, sortField);
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [troops, search, sortField, sortDir]);

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
        placeholder="Search troop number, name, or service unit..."
        className="mt-6 w-full max-w-sm rounded border px-3 py-1.5 text-sm"
      />

      <table className="mt-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b text-green-800">
            <th className="cursor-pointer select-none pb-2" onClick={() => toggleSort("troopNumber")}>
              Troop #{sortIndicator("troopNumber")}
            </th>
            <th className="cursor-pointer select-none pb-2" onClick={() => toggleSort("name")}>
              Name{sortIndicator("name")}
            </th>
            <th className="cursor-pointer select-none pb-2" onClick={() => toggleSort("serviceUnitArea")}>
              Service Unit{sortIndicator("serviceUnitArea")}
            </th>
            <th
              className="cursor-pointer select-none pb-2 text-right"
              onClick={() => toggleSort("scouts")}
            >
              Scouts{sortIndicator("scouts")}
            </th>
            <th
              className="cursor-pointer select-none pb-2 text-right"
              onClick={() => toggleSort("booths")}
            >
              Booths{sortIndicator("booths")}
            </th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {visibleTroops.map((troop) => (
            <TroopRow
              key={troop.id}
              troop={troop}
              canEdit={isSuperAdmin || editableTroopIds.includes(troop.id)}
            />
          ))}

          {visibleTroops.length === 0 && (
            <tr>
              <td colSpan={6} className="py-4 text-center text-sm text-gray-400">
                {troops.length === 0 ? "No troops yet. Add one above." : "No troops match your search."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
