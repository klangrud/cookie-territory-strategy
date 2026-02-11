export const BOOTH_TYPES = {
  neighborhood: { radiusMiles: 1, pinLabel: "N", label: "Neighborhood" },
  storefront: { radiusMiles: 2, pinLabel: "S", label: "Storefront" },
  rural: { radiusMiles: 5, pinLabel: "R", label: "Rural" },
} as const;

export type BoothType = keyof typeof BOOTH_TYPES;

export const BOOTH_TYPE_VALUES = Object.keys(BOOTH_TYPES) as BoothType[];

export function getBoothRadius(type: string): number {
  return BOOTH_TYPES[type as BoothType]?.radiusMiles ?? BOOTH_TYPES.storefront.radiusMiles;
}

export function getBoothPinLabel(type: string): string {
  return BOOTH_TYPES[type as BoothType]?.pinLabel ?? "S";
}
