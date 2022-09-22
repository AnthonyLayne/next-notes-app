import { DAY_OF_WEEK } from "./constants";
import { N, TimeUnit } from "./types";

// --------------------------------------------------------------------------------------------------------------------
const t = new Map<TimeUnit, number>();
const get = (key: TimeUnit) => t.get(key)!;

const numberOfMillisecondsIn = t
  .set("milliseconds", 1)
  .set("seconds", 1_000 * get("milliseconds"))
  .set("minutes", 60 * get("seconds"))
  .set("hours", 60 * get("minutes"))
  .set("days", 24 * get("hours"))
  .set("weeks", 7 * get("days"))
  .set("years", 365 * get("days"));

const getConverter = (numUnits: N, unit: TimeUnit) => {
  const ms = Math.round(numUnits * numberOfMillisecondsIn.get(unit)!);

  return {
    in(u: TimeUnit) {
      return ms / numberOfMillisecondsIn.get(u)!;
    },

    ms,
  };
};

export const milliseconds = (numUnits: N) => getConverter(numUnits, "milliseconds");
export const seconds = (numUnits: N) => getConverter(numUnits, "seconds");
export const minutes = (numUnits: N) => getConverter(numUnits, "minutes");
export const hours = (numUnits: N) => getConverter(numUnits, "hours");
export const days = (numUnits: N) => getConverter(numUnits, "days");
export const weeks = (numUnits: N) => getConverter(numUnits, "weeks");
export const years = (numUnits: N) => getConverter(numUnits, "years");
// --------------------------------------------------------------------------------------------------------------------

// ---- Display -------------------------------------------------------------------------------------------------------
/** Fri, Dec 10, 2021 for US Locale */
export const getDisplayDayMonthDateAndYear = (
  timestamp: number,
  { locale = "default", options }: { locale?: string; options?: Intl.DateTimeFormatOptions } = { locale: "default" }
) => {
  const date = Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(timestamp));
  const dayOfWeek = new Date(timestamp).getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;

  return `${DAY_OF_WEEK[dayOfWeek]}, ${date}`;
};

/** 3:04 PM for US Locale */
export const getDisplayTime = (timestamp: number, locale = "default") => {
  const date = Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));

  return date;
};
// --------------------------------------------------------------------------------------------------------------------
