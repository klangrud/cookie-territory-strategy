"use client";

import { useRef, useState } from "react";
import { createBooth, deleteBooth } from "@/lib/actions/booth.actions";
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

interface BoothManagerProps {
  troopId: string;
  booths: Booth[];
}

export function BoothManager({ troopId, booths }: BoothManagerProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [boothType, setBoothType] = useState("storefront");
  const [sourceBoothId, setSourceBoothId] = useState<string | null>(null);

  function handleCopy(booth: Booth) {
    setName(booth.name);
    setDescription(booth.description ?? "");
    setStreet(booth.street);
    setCity(booth.city);
    setState(booth.state);
    setZip(booth.zip);
    setDate("");
    setStartTime(booth.startTime);
    setEndTime(booth.endTime);
    setBoothType(booth.boothType);
    setSourceBoothId(booth.id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function resetForm() {
    setName("");
    setDescription("");
    setStreet("");
    setCity("");
    setState("");
    setZip("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setBoothType("storefront");
    setSourceBoothId(null);
  }

  async function handleSubmit(formData: FormData) {
    await createBooth(formData);
    resetForm();
  }

  return (
    <>
      <form
        ref={formRef}
        action={handleSubmit}
        className="mt-6 rounded border bg-green-50 p-4"
      >
        <h2 className="mb-3 text-sm font-semibold text-green-900">Add Booth</h2>
        <input type="hidden" name="troopId" value={troopId} />
        {sourceBoothId && (
          <input type="hidden" name="sourceBoothId" value={sourceBoothId} />
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Name *
            </label>
            <input
              name="name"
              required
              placeholder="e.g. Walmart on 5th"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSourceBoothId(null);
              }}
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Description
            </label>
            <input
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={street}
              onChange={(e) => setStreet(e.target.value)}
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
              value={city}
              onChange={(e) => setCity(e.target.value)}
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
              value={state}
              onChange={(e) => setState(e.target.value)}
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
              value={zip}
              onChange={(e) => setZip(e.target.value)}
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
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
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Type
            </label>
            <select
              name="boothType"
              value={boothType}
              onChange={(e) => setBoothType(e.target.value)}
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
        </div>
        <button
          type="submit"
          className="mt-3 rounded bg-green-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Booth
        </button>
      </form>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b text-green-800">
            <th className="pb-2">Name</th>
            <th className="pb-2">Type</th>
            <th className="pb-2">Address</th>
            <th className="pb-2">Date</th>
            <th className="pb-2">Time</th>
            <th className="pb-2 text-center">Geocoded</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {booths.map((booth) => (
            <tr key={booth.id} className="border-b">
              <td className="py-2 font-medium">{booth.name}</td>
              <td className="py-2 text-gray-500 capitalize">
                {booth.boothType}
              </td>
              <td className="py-2 text-gray-600">
                {booth.street}, {booth.city}, {booth.state} {booth.zip}
              </td>
              <td className="py-2">
                {new Date(booth.date).toLocaleDateString()}
              </td>
              <td className="py-2">
                {booth.startTime}–{booth.endTime}
              </td>
              <td className="py-2 text-center">
                {booth.latitude && booth.longitude ? (
                  <span
                    className="text-green-600"
                    title={`${booth.latitude}, ${booth.longitude}`}
                  >
                    ✓
                  </span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
              </td>
              <td className="py-2 text-right space-x-2">
                <button
                  type="button"
                  onClick={() => handleCopy(booth)}
                  className="text-xs text-green-700 hover:text-green-900"
                >
                  Copy
                </button>
                <form action={deleteBooth} className="inline">
                  <input type="hidden" name="id" value={booth.id} />
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

          {booths.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="py-4 text-center text-sm text-gray-400"
              >
                No booths yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
