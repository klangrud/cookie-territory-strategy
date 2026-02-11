"use client";

import { useState } from "react";
import type { ColorMode } from "./territory-map";

interface MapControlsProps {
  showScouts: boolean;
  showBooths: boolean;
  showRadius: boolean;
  showHeatmap: boolean;
  radiusMiles: number;
  troopNumbers: string[];
  visibleTroops: Set<string>;
  onToggleScouts: () => void;
  onToggleBooths: () => void;
  onToggleRadius: () => void;
  onToggleHeatmap: () => void;
  onRadiusChange: (value: number) => void;
  onToggleTroop: (troopNumber: string) => void;
  onSelectAllTroops: () => void;
  onDeselectAllTroops: () => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
}

export function MapControls({
  showScouts,
  showBooths,
  showRadius,
  showHeatmap,
  radiusMiles,
  troopNumbers,
  visibleTroops,
  onToggleScouts,
  onToggleBooths,
  onToggleRadius,
  onToggleHeatmap,
  onRadiusChange,
  onToggleTroop,
  onSelectAllTroops,
  onDeselectAllTroops,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  colorMode,
  onColorModeChange,
}: MapControlsProps) {
  const [troopsExpanded, setTroopsExpanded] = useState(true);

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 shadow-md">
      <h3 className="text-sm font-semibold uppercase text-gray-700">Layers</h3>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-gray-900">
          <input
            type="checkbox"
            checked={showScouts}
            onChange={onToggleScouts}
            className="rounded"
          />
          Scout Addresses
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-900">
          <input
            type="checkbox"
            checked={showBooths}
            onChange={onToggleBooths}
            className="rounded"
          />
          Cookie Booths
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-900">
          <input
            type="checkbox"
            checked={showRadius}
            onChange={onToggleRadius}
            className="rounded"
          />
          Radius Overlay
        </label>
        {showRadius && (
          <div className="ml-6">
            <label className="text-xs text-gray-600">
              Scout Radius: {radiusMiles} mi
            </label>
            <input
              type="range"
              min="0.25"
              max="2"
              step="0.25"
              value={radiusMiles}
              onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        <label className="flex items-center gap-2 text-sm text-gray-900">
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={onToggleHeatmap}
            className="rounded"
          />
          Heat Map
        </label>
      </div>

      <hr />

      <div>
        <h3 className="text-sm font-semibold uppercase text-gray-700">
          Booth Colors
        </h3>
        <div className="mt-2 flex gap-1">
          <button
            onClick={() => onColorModeChange("troop")}
            className={`rounded px-2 py-1 text-xs font-medium ${
              colorMode === "troop"
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            By Troop
          </button>
          <button
            onClick={() => onColorModeChange("date")}
            className={`rounded px-2 py-1 text-xs font-medium ${
              colorMode === "date"
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            By Date
          </button>
        </div>
      </div>

      <hr />

      <div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setTroopsExpanded((v) => !v)}
            className="flex items-center gap-1 text-sm font-semibold uppercase text-gray-700"
          >
            <svg
              className={`h-3.5 w-3.5 transition-transform ${troopsExpanded ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Troops ({troopNumbers.length})
          </button>
          <div className="space-x-2 text-xs">
            <button
              onClick={onSelectAllTroops}
              className="text-green-700 hover:underline"
            >
              All
            </button>
            <button
              onClick={onDeselectAllTroops}
              className="text-green-700 hover:underline"
            >
              None
            </button>
          </div>
        </div>
        {troopsExpanded && (
          <div className="mt-2 space-y-1">
            {troopNumbers.map((tn) => (
              <label key={tn} className="flex items-center gap-2 text-sm text-gray-900">
                <input
                  type="checkbox"
                  checked={visibleTroops.has(tn)}
                  onChange={() => onToggleTroop(tn)}
                  className="rounded"
                />
                Troop {tn}
              </label>
            ))}
          </div>
        )}
      </div>

      <hr />

      <div>
        <h3 className="text-sm font-semibold uppercase text-gray-700">
          Booth Date Range
        </h3>
        <div className="mt-2 space-y-2">
          <div>
            <label className="text-xs text-gray-600">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
