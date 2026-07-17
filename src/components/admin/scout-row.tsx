"use client";

import { useState } from "react";
import { updateScout, deleteScout } from "@/lib/actions/scout.actions";

interface Scout {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
}

interface ScoutRowProps {
  scout: Scout;
  troopId: string;
  canEdit: boolean;
}

export function ScoutRow({ scout, troopId, canEdit }: ScoutRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleSubmit(formData: FormData) {
    await updateScout(formData);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <tr className="border-b bg-green-50">
        <td colSpan={4} className="py-3">
          <form action={handleSubmit} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={scout.id} />
            <input type="hidden" name="troopId" value={troopId} />
            <div>
              <label className="block text-xs font-medium text-gray-600">
                First Name *
              </label>
              <input
                name="firstName"
                required
                defaultValue={scout.firstName}
                className="mt-1 w-32 rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Last Name *
              </label>
              <input
                name="lastName"
                required
                defaultValue={scout.lastName}
                className="mt-1 w-32 rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Street *
              </label>
              <input
                name="street"
                required
                defaultValue={scout.street}
                className="mt-1 w-48 rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                City *
              </label>
              <input
                name="city"
                required
                defaultValue={scout.city}
                className="mt-1 w-32 rounded border px-2 py-1 text-sm"
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
                defaultValue={scout.state}
                className="mt-1 w-16 rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                ZIP *
              </label>
              <input
                name="zip"
                required
                defaultValue={scout.zip}
                className="mt-1 w-24 rounded border px-2 py-1 text-sm"
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
            <form action={deleteScout} className="inline">
              <input type="hidden" name="id" value={scout.id} />
              <input type="hidden" name="troopId" value={troopId} />
              <button
                type="submit"
                onClick={(e) => {
                  if (
                    !confirm(
                      `Delete ${scout.firstName} ${scout.lastName}? This cannot be undone.`
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
