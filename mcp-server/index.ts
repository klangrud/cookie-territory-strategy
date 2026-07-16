#!/usr/bin/env node
/**
 * MCP server for the cookie territory strategy app.
 *
 * Scope: non-PII data only (troops, booths, aggregate stats). No scout names
 * or addresses are exposed here — see README's Privacy & Data Protection
 * section for why that boundary exists.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { getDashboardStats } from "../src/lib/queries/analytics.queries";
import {
  getBoothsFiltered,
  getUngeocodedBooths,
} from "../src/lib/queries/booth.queries";
import { getAllTroops, getTroopByNumber } from "../src/lib/queries/troop.queries";

function jsonResult(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

const server = new McpServer({
  name: "cookie-territory-strategy",
  version: "0.1.0",
});

server.registerTool(
  "list_troops",
  {
    description:
      "List all troops with their scout/booth counts. No scout names or addresses are included.",
  },
  async () => {
    const troops = await getAllTroops();
    return jsonResult(
      troops.map((t) => ({
        troopNumber: t.troopNumber,
        name: t.name,
        serviceUnitArea: t.serviceUnitArea,
        scoutCount: t._count.scouts,
        boothCount: t._count.booths,
      }))
    );
  }
);

server.registerTool(
  "get_troop",
  {
    description: "Get details for a single troop by its troop number.",
    inputSchema: {
      troopNumber: z.string().describe("The troop's number, e.g. \"123\""),
    },
  },
  async ({ troopNumber }) => {
    const troop = await getTroopByNumber(troopNumber);
    if (!troop) {
      return jsonResult({ error: `No troop found with number "${troopNumber}"` });
    }
    return jsonResult({
      troopNumber: troop.troopNumber,
      name: troop.name,
      description: troop.description,
      serviceUnitArea: troop.serviceUnitArea,
      scoutCount: troop._count.scouts,
      boothCount: troop._count.booths,
    });
  }
);

server.registerTool(
  "list_booths",
  {
    description:
      "List booth locations, optionally filtered by troop number and/or date range (YYYY-MM-DD).",
    inputSchema: {
      troopNumber: z.string().optional(),
      dateFrom: z.string().optional().describe("Inclusive start date, YYYY-MM-DD"),
      dateTo: z.string().optional().describe("Inclusive end date, YYYY-MM-DD"),
    },
  },
  async ({ troopNumber, dateFrom, dateTo }) => {
    const booths = await getBoothsFiltered({
      troopNumber,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
    return jsonResult(
      booths.map((b) => ({
        name: b.name,
        troopNumber: b.troop.troopNumber,
        boothType: b.boothType,
        address: `${b.street}, ${b.city}, ${b.state} ${b.zip}`,
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime,
        geocoded: b.latitude !== null && b.longitude !== null,
      }))
    );
  }
);

server.registerTool(
  "list_ungeocoded_booths",
  {
    description:
      "List booths that are missing coordinates and won't show up on the map, so an admin can fix their addresses.",
  },
  async () => {
    const booths = await getUngeocodedBooths();
    return jsonResult(
      booths.map((b) => ({
        name: b.name,
        troopNumber: b.troop.troopNumber,
        address: `${b.street}, ${b.city}, ${b.state} ${b.zip}`,
      }))
    );
  }
);

server.registerTool(
  "get_dashboard_stats",
  {
    description:
      "Get overall counts (troops, scouts, booths) and geocoding coverage rates. Scout count is a total only — no scout details.",
  },
  async () => {
    const stats = await getDashboardStats();
    return jsonResult({
      troopCount: stats.troopCount,
      scoutCount: stats.scoutCount,
      boothCount: stats.boothCount,
      scoutGeoRate: stats.scoutGeoRate,
      boothGeoRate: stats.boothGeoRate,
    });
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("cookie-territory-strategy MCP server failed to start:", err);
  process.exit(1);
});
