export const SLEEP_FACTORS = [
  "caffeine",
  "exercise",
  "stress",
  "screen",
  "alcohol",
  "meditation",
  "reading",
  "late_meal",
] as const;

export type SleepFactor = (typeof SLEEP_FACTORS)[number];

