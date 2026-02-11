import { z } from "zod";

export const createTroopSchema = z.object({
  troopNumber: z.string().min(1, "Troop number is required"),
  name: z.string().optional().default(""),
  description: z.string().optional().default(""),
  serviceUnitArea: z.string().optional().default(""),
});

export const updateTroopSchema = createTroopSchema.extend({
  id: z.string().min(1),
});
