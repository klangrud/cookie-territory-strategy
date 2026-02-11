"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { importScoutRowSchema } from "@/lib/validators/import.validators";
import { importScouts } from "@/lib/actions/import.actions";

interface RowError {
  row: number;
  message: string;
}

export function ScoutImport() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [clientErrors, setClientErrors] = useState<RowError[]>([]);
  const [result, setResult] = useState<{
    totalRows: number;
    created: number;
    errors: RowError[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setResult(null);
    setClientErrors([]);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        raw: false,
      });
      const json = raw.map((row) => {
        const clean: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(row))
          clean[k.replace(/^\uFEFF/, "").trim()] = v;
        return clean;
      });

      const errors: RowError[] = [];
      json.forEach((row, i) => {
        const parsed = importScoutRowSchema.safeParse(row);
        if (!parsed.success) {
          const msg = Object.values(parsed.error.flatten().fieldErrors)
            .flat()
            .join(", ");
          errors.push({ row: i + 2, message: msg });
        }
      });

      setRows(json);
      setClientErrors(errors);
    };
    reader.readAsArrayBuffer(file);
  }

  async function handleImport() {
    setLoading(true);
    try {
      const res = await importScouts(rows);
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  const validCount = rows.length - clientErrors.length;

  return (
    <div className="space-y-4">
      <div className="rounded border bg-gray-50 p-4 text-sm text-gray-600">
        <p className="mb-2 font-medium text-gray-800">
          Expected columns:
        </p>
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-1 text-left">troopNumber</th>
                <th className="px-2 py-1 text-left">firstName</th>
                <th className="px-2 py-1 text-left">lastName</th>
                <th className="px-2 py-1 text-left">street</th>
                <th className="px-2 py-1 text-left">city</th>
                <th className="px-2 py-1 text-left">state</th>
                <th className="px-2 py-1 text-left">zip</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-gray-500">
                <td className="px-2 py-1">1234</td>
                <td className="px-2 py-1">Jane</td>
                <td className="px-2 py-1">Doe</td>
                <td className="px-2 py-1">123 Main St</td>
                <td className="px-2 py-1">Springfield</td>
                <td className="px-2 py-1">IL</td>
                <td className="px-2 py-1">62701</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          All columns shown above are required. Extra columns in your file will be ignored.
        </p>
      </div>

      <input
        type="file"
        accept=".xlsx,.csv"
        onChange={handleFile}
        className="block text-sm file:mr-3 file:rounded file:border file:border-gray-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-50"
      />

      {rows.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm">
            {rows.length} row{rows.length !== 1 && "s"} parsed
            {clientErrors.length > 0 && (
              <span className="text-red-600">
                {" "}
                ({clientErrors.length} with errors)
              </span>
            )}
          </p>

          {clientErrors.length > 0 && (
            <ul className="max-h-40 overflow-y-auto rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">
              {clientErrors.map((err, i) => (
                <li key={i}>
                  Row {err.row}: {err.message}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleImport}
            disabled={loading || validCount === 0}
            className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
          >
            {loading ? "Importing..." : `Import ${validCount} Scout${validCount !== 1 ? "s" : ""}`}
          </button>
        </div>
      )}

      {result && (
        <div className="rounded border p-3 text-sm">
          <p className="font-medium text-green-700">
            Created {result.created} of {result.totalRows} scouts
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-2 max-h-40 overflow-y-auto text-xs text-red-600">
              {result.errors.map((err, i) => (
                <li key={i}>
                  Row {err.row}: {err.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
