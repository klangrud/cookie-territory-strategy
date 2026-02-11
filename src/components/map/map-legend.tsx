"use client";

import type { ColorMode } from "./territory-map";
import { DATE_COLORS } from "@/lib/date-colors";

interface MapLegendProps {
  troopColors: { troopNumber: string; color: string }[];
  colorMode: ColorMode;
}

export function MapLegend({ troopColors, colorMode }: MapLegendProps) {
  if (colorMode === "date") {
    return (
      <div className="rounded-lg bg-white p-3 shadow-md">
        <h3 className="mb-2 text-xs font-semibold uppercase text-gray-700">
          Booth Dates
        </h3>
        <div className="space-y-1">
          {Object.values(DATE_COLORS).map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-gray-900">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (troopColors.length === 0) return null;

  return (
    <div className="rounded-lg bg-white p-3 shadow-md">
      <h3 className="mb-2 text-xs font-semibold uppercase text-gray-700">
        Troops
      </h3>
      <div className="space-y-1">
        {troopColors.map(({ troopNumber, color }) => (
          <div key={troopNumber} className="flex items-center gap-2 text-sm text-gray-900">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span>Troop {troopNumber}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
