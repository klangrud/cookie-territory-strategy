import { z } from "zod";

export const createMembershipSchema = z.object({
  userId: z.string().min(1, "User is required"),
  troopId: z.string().min(1, "Troop is required"),
  role: z.enum(["LEADER", "REGIONAL"]),
});
