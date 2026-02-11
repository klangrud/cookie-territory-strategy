import { z } from "zod";
import { BOOTH_TYPE_VALUES } from "@/lib/booth-types";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createBoothSchema = z.object({
  troopId: z.string().min(1, "Troop is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zip: z.string().min(5, "ZIP code is required"),
  date: z.coerce.date({ error: "Date is required" }),
  startTime: z.string().regex(timeRegex, "Start time must be HH:MM format"),
  endTime: z.string().regex(timeRegex, "End time must be HH:MM format"),
  boothType: z.enum(BOOTH_TYPE_VALUES as [string, ...string[]]).default("storefront"),
});

export const updateBoothSchema = createBoothSchema.extend({
  id: z.string().min(1),
});
