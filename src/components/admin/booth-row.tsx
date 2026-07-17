"use client";

import { useState } from "react";
import { updateBooth, deleteBooth } from "@/lib/actions/booth.actions";
import { BOOTH_TYPES, type BoothType } from "@/lib/booth-types";

interface Booth {
  id: string;
  name: string;
  description: string | null;
  street: string;
  city: string;
  state: string;
  zip: string;
  date: Date;
  startTime: string;
  endTime: string;
  boothType: string;
  latitude: number | null;
  longitude: number | null;
}

interface BoothRowProps {
  booth: Booth;
  troopId: string;
  canEdit: boolean;
  onCopy: (booth: Booth) => void;
}

function toDateInputValue(date: Date): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export function BoothRow({ booth, troopId, canEdit, onCopy }: BoothRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleSubmit(formData: FormData) {
    await updateBooth(formData);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <tr className="border-b bg-green-50">
        <td colSpan={7} className="py-3">
          <form action={handleSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <input type="hidden" name="id" value={booth.id} />
            <input type="hidden" name="troopId" value={troopId} />
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Name *
              </label>
              <input
                name="name"
                required
                defaultValue={booth.name}
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Description
              </label>
              <input
                name="description"
                defaultValue={booth.description ?? ""}
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
                defaultValue={booth.street}
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
                defaultValue={booth.city}
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
                defaultValue={booth.state}
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
                defaultValue={booth.zip}
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Date *
              </label>
              <input
                name="date"
                type="date"
                required
                defaultValue={toDateInputValue(booth.date)}
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Start Time *
              </label>
              <input
                name="startTime"
                type="time"
                required
                defaultValue={booth.startTime}
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                End Time *
              </label>
              <input
                name="endTime"
                type="time"
                required
                defaultValue={booth.endTime}
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Type
              </label>
              <select
                name="boothType"
                defaultValue={booth.boothType}
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
              >
                {(
                  Object.entries(BOOTH_TYPES) as [
                    BoothType,
                    (typeof BOOTH_TYPES)[BoothType],
                  ][]
                ).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex items-end gap-2">
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
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b">
      <td className="py-2 font-medium">{booth.name}</td>
      <td className="py-2 text-gray-500 capitalize">{booth.boothType}</td>
      <td className="py-2 text-gray-600">
        {booth.street}, {booth.city}, {booth.state} {booth.zip}
      </td>
      <td className="py-2">{new Date(booth.date).toLocaleDateString()}</td>
      <td className="py-2">
        {booth.startTime}–{booth.endTime}
      </td>
      <td className="py-2 text-center">
        {booth.latitude && booth.longitude ? (
          <span className="text-green-600" title={`${booth.latitude}, ${booth.longitude}`}>
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
            <button
              type="button"
              onClick={() => onCopy(booth)}
              className="text-xs text-green-700 hover:text-green-900"
            >
              Copy
            </button>
            <form action={deleteBooth} className="inline">
              <input type="hidden" name="id" value={booth.id} />
              <input type="hidden" name="troopId" value={troopId} />
              <button
                type="submit"
                onClick={(e) => {
                  if (!confirm(`Delete booth "${booth.name}"? This cannot be undone.`)) {
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
