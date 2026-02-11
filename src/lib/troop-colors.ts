const PALETTE = [
  "#e6194b", // red
  "#3cb44b", // green
  "#4363d8", // blue
  "#f58231", // orange
  "#911eb4", // purple
  "#42d4f4", // cyan
  "#f032e6", // magenta
  "#bfef45", // lime
  "#fabed4", // pink
  "#469990", // teal
  "#dcbeff", // lavender
  "#9a6324", // brown
  "#fffac8", // beige
  "#800000", // maroon
  "#aaffc3", // mint
  "#808000", // olive
  "#ffd8b1", // apricot
  "#000075", // navy
  "#a9a9a9", // gray
  "#e6beff", // orchid
];

const troopColorMap = new Map<string, string>();

export function getTroopColor(troopNumber: string): string {
  if (troopColorMap.has(troopNumber)) {
    return troopColorMap.get(troopNumber)!;
  }
  const index = troopColorMap.size % PALETTE.length;
  const color = PALETTE[index];
  troopColorMap.set(troopNumber, color);
  return color;
}

export function buildTroopColorMap(troopNumbers: string[]): Map<string, string> {
  troopColorMap.clear();
  const sorted = [...troopNumbers].sort();
  sorted.forEach((tn, i) => {
    troopColorMap.set(tn, PALETTE[i % PALETTE.length]);
  });
  return new Map(troopColorMap);
}
