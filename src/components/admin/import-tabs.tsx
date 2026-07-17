"use client";

import { useState } from "react";
import { TroopImport } from "@/components/import/troop-import";
import { ScoutImport } from "@/components/import/scout-import";
import { BoothImport } from "@/components/import/booth-import";

const tabs = ["Import Troops", "Import Scouts", "Import Booths"] as const;

export function ImportTabs() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Import Troops");

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-green-900">Bulk Import</h1>

      <div className="mb-4 flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-green-700 text-green-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Import Troops" && <TroopImport />}
      {activeTab === "Import Scouts" && <ScoutImport />}
      {activeTab === "Import Booths" && <BoothImport />}
    </div>
  );
}
