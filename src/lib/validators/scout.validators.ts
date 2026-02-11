import { z } from "zod";

export const createScoutSchema = z.object({
  troopId: z.string().min(1, "Troop is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zip: z.string().min(5, "ZIP code is required"),
});

export const updateScoutSchema = createScoutSchema.extend({
  id: z.string().min(1),
});
