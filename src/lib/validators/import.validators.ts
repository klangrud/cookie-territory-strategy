import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const importTroopRowSchema = z.object({
  troopNumber: z.coerce.string().min(1, "Troop number is required"),
  name: z.string().optional().default(""),
  description: z.string().optional().default(""),
  serviceUnitArea: z.string().optional().default(""),
});

export const importScoutRowSchema = z.object({
  troopNumber: z.coerce.string().min(1, "Troop number is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zip: z.coerce.string().min(5, "ZIP code is required"),
});

export const importBoothRowSchema = z.object({
  troopNumber: z.coerce.string().min(1, "Troop number is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zip: z.coerce.string().min(5, "ZIP code is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().regex(timeRegex, "Start time must be HH:MM format"),
  endTime: z.string().regex(timeRegex, "End time must be HH:MM format"),
  boothType: z.string().optional().default("storefront"),
});
