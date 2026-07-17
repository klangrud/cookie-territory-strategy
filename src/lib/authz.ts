import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export type AccessScope = {
  userId: string;
  isSuperAdmin: boolean;
  editableTroopIds: string[];
  viewableTroopIds: string[];
  /** Distinct membership roles held by this user — for display only; see canEditTroop for actual permissions. */
  roles: ("LEADER" | "REGIONAL")[];
};

export async function getAccessScope(userId: string): Promise<AccessScope> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      isSuperAdmin: true,
      troopMemberships: { select: { troopId: true, role: true } },
    },
  });

  if (!user) {
    return {
      userId,
      isSuperAdmin: false,
      editableTroopIds: [],
      viewableTroopIds: [],
      roles: [],
    };
  }

  // LEADER and REGIONAL carry identical permissions today — the role only
  // documents *why* someone has access (their own troop vs. covering a
  // region on behalf of troops without a dedicated leader yet).
  const viewableTroopIds = user.troopMemberships.map((m) => m.troopId);
  const editableTroopIds = viewableTroopIds;
  const roles = [...new Set(user.troopMemberships.map((m) => m.role))];

  return {
    userId,
    isSuperAdmin: user.isSuperAdmin,
    editableTroopIds,
    viewableTroopIds,
    roles,
  };
}

export function getRoleLabel(scope: AccessScope): string {
  if (scope.isSuperAdmin) return "Superadmin";
  if (scope.roles.includes("LEADER")) return "Troop Leader";
  if (scope.roles.includes("REGIONAL")) return "Regional Leader";
  return "No troop assigned";
}

export async function requireAccessScope(): Promise<AccessScope> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return getAccessScope(session.user.id);
}

export function canEditTroop(scope: AccessScope, troopId: string): boolean {
  return scope.isSuperAdmin || scope.editableTroopIds.includes(troopId);
}

export function canViewTroop(scope: AccessScope, troopId: string): boolean {
  return scope.isSuperAdmin || scope.viewableTroopIds.includes(troopId);
}

export function assertCanEditTroop(scope: AccessScope, troopId: string): void {
  if (!canEditTroop(scope, troopId)) {
    throw new Error("You don't have permission to edit this troop.");
  }
}

/**
 * Resolves the current session's scope for a mutating server action.
 * Throws (rather than redirecting) since actions can't redirect mid-mutation.
 */
export async function requireActionScope(): Promise<AccessScope> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  return getAccessScope(session.user.id);
}
