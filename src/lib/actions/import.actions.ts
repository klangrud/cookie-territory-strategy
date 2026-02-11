"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { geocodeAddress } from "@/lib/geocode";
import {
  importTroopRowSchema,
  importScoutRowSchema,
  importBoothRowSchema,
} from "@/lib/validators/import.validators";

interface ImportResult {
  totalRows: number;
  created: number;
  errors: { row: number; message: string }[];
}

export async function importTroops(
  rows: Record<string, unknown>[]
): Promise<ImportResult> {
  const result: ImportResult = { totalRows: rows.length, created: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2;
    const parsed = importTroopRowSchema.safeParse(rows[i]);
    if (!parsed.success) {
      const msg = Object.values(parsed.error.flatten().fieldErrors).flat().join(", ");
      result.errors.push({ row: rowNum, message: msg });
      continue;
    }

    try {
      await db.troop.upsert({
        where: { troopNumber: parsed.data.troopNumber },
        create: {
          troopNumber: parsed.data.troopNumber,
          name: parsed.data.name || null,
          description: parsed.data.description || null,
          serviceUnitArea: parsed.data.serviceUnitArea || null,
        },
        update: {
          name: parsed.data.name || undefined,
          description: parsed.data.description || undefined,
          serviceUnitArea: parsed.data.serviceUnitArea || undefined,
        },
      });
      result.created++;
    } catch (err) {
      result.errors.push({
        row: rowNum,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  revalidatePath("/admin/troops");
  return result;
}

export async function importScouts(
  rows: Record<string, unknown>[]
): Promise<ImportResult> {
  const result: ImportResult = { totalRows: rows.length, created: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2; // 1-indexed + header row
    const parsed = importScoutRowSchema.safeParse(rows[i]);
    if (!parsed.success) {
      const msg = Object.values(parsed.error.flatten().fieldErrors).flat().join(", ");
      result.errors.push({ row: rowNum, message: msg });
      continue;
    }

    const troop = await db.troop.findUnique({
      where: { troopNumber: parsed.data.troopNumber },
    });
    if (!troop) {
      result.errors.push({
        row: rowNum,
        message: `Troop ${parsed.data.troopNumber} not found`,
      });
      continue;
    }

    try {
      const scout = await db.scout.create({
        data: {
          troopId: troop.id,
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          street: parsed.data.street,
          city: parsed.data.city,
          state: parsed.data.state,
          zip: parsed.data.zip,
        },
      });

      const coords = await geocodeAddress(
        parsed.data.street,
        parsed.data.city,
        parsed.data.state,
        parsed.data.zip
      );
      if (coords) {
        await db.scout.update({ where: { id: scout.id }, data: coords });
      }

      result.created++;
    } catch (err) {
      result.errors.push({
        row: rowNum,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  revalidatePath("/admin/scouts");
  revalidatePath("/");
  return result;
}

export async function importBooths(
  rows: Record<string, unknown>[]
): Promise<ImportResult> {
  const result: ImportResult = { totalRows: rows.length, created: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2;
    const parsed = importBoothRowSchema.safeParse(rows[i]);
    if (!parsed.success) {
      const msg = Object.values(parsed.error.flatten().fieldErrors).flat().join(", ");
      result.errors.push({ row: rowNum, message: msg });
      continue;
    }

    const troop = await db.troop.findUnique({
      where: { troopNumber: parsed.data.troopNumber },
    });
    if (!troop) {
      result.errors.push({
        row: rowNum,
        message: `Troop ${parsed.data.troopNumber} not found`,
      });
      continue;
    }

    try {
      const booth = await db.booth.create({
        data: {
          troopId: troop.id,
          name: parsed.data.name,
          description: parsed.data.description || null,
          street: parsed.data.street,
          city: parsed.data.city,
          state: parsed.data.state,
          zip: parsed.data.zip,
          date: new Date(parsed.data.date),
          startTime: parsed.data.startTime,
          endTime: parsed.data.endTime,
          boothType: parsed.data.boothType,
        },
      });

      const coords = await geocodeAddress(
        parsed.data.street,
        parsed.data.city,
        parsed.data.state,
        parsed.data.zip
      );
      if (coords) {
        await db.booth.update({ where: { id: booth.id }, data: coords });
      }

      result.created++;
    } catch (err) {
      result.errors.push({
        row: rowNum,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  revalidatePath("/admin/booths");
  revalidatePath("/");
  return result;
}
