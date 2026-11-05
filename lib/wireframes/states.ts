export type ViewerState = "v" | "f" | "m";
export const STATES: { key: ViewerState; label: string }[] = [
  { key: "v", label: "Visitor" },
  { key: "f", label: "Free subscriber" },
  { key: "m", label: "Member" },
];
export const STATE_COOKIE = "wf_as";
