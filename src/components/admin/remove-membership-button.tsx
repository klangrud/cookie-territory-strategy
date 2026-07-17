"use client";

import { deleteMembership } from "@/lib/actions/membership.actions";

interface RemoveMembershipButtonProps {
  membershipId: string;
  troopLabel: string;
}

export function RemoveMembershipButton({
  membershipId,
  troopLabel,
}: RemoveMembershipButtonProps) {
  return (
    <form action={deleteMembership} className="inline">
      <input type="hidden" name="id" value={membershipId} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`Remove this membership for ${troopLabel}?`)) {
            e.preventDefault();
          }
        }}
        className="text-xs text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </form>
  );
}
