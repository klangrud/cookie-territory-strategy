"use client";

import { useState } from "react";
import { updateTroop, deleteTroop } from "@/lib/actions/troop.actions";

interface Troop {
  id: string;
  troopNumber: string;
  name: string | null;
  description: string | null;
  serviceUnitArea: string | null;
  _count: { scouts: number; booths: number };
}

interface TroopRowProps {
  troop: Troop;
  canEdit: boolean;
}

export function TroopRow({ troop, canEdit }: TroopRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleSubmit(formData: FormData) {
    await updateTroop(formData);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <tr className="border-b bg-green-50">
        <td colSpan={6} className="py-3">
          <form action={handleSubmit} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={troop.id} />
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Troop Number *
              </label>
              <input
                name="troopNumber"
                required
                defaultValue={troop.troopNumber}
                className="mt-1 w-28 rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Name
              </label>
              <input
                name="name"
                defaultValue={troop.name ?? ""}
                className="mt-1 w-40 rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Description
              </label>
              <input
                name="description"
                defaultValue={troop.description ?? ""}
                className="mt-1 w-40 rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Service Unit Area
              </label>
              <input
                name="serviceUnitArea"
                defaultValue={troop.serviceUnitArea ?? ""}
                className="mt-1 w-40 rounded border px-2 py-1 text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-800"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b">
      <td className="py-2 font-medium">{troop.troopNumber}</td>
      <td className="py-2">{troop.name || "—"}</td>
      <td className="py-2">{troop.serviceUnitArea || "—"}</td>
      <td className="py-2 text-right">{troop._count.scouts}</td>
      <td className="py-2 text-right">{troop._count.booths}</td>
      <td className="py-2 text-right space-x-2">
        {canEdit && (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs text-green-700 hover:text-green-900"
            >
              Edit
            </button>
            <form action={deleteTroop} className="inline">
              <input type="hidden" name="id" value={troop.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (
                    !confirm(
                      `Delete Troop ${troop.troopNumber}? This also permanently deletes its ${troop._count.scouts} scout(s) and ${troop._count.booths} booth(s). This cannot be undone.`
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </form>
          </>
        )}
      </td>
    </tr>
  );
}
