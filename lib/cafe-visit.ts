export const CAFE_OPEN_TIME = "11:00";
export const CAFE_CLOSE_TIME = "23:00";
export const MIN_CAFE_PREPARATION_MINUTES = 15;

const MINUTE_IN_MS = 60_000;

function getCafePreparationReadyAt(now: Date) {
  const currentMinute =
    Math.floor(now.getTime() / MINUTE_IN_MS) * MINUTE_IN_MS;

  return currentMinute + MIN_CAFE_PREPARATION_MINUTES * MINUTE_IN_MS;
}

function getTimeInSamara(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Europe/Samara"
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("hour")}:${part("minute")}`;
}

export function getTodayInSamara(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Samara"
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function isCafeVisitTime(time: string) {
  return (
    /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time) &&
    time >= CAFE_OPEN_TIME &&
    time <= CAFE_CLOSE_TIME
  );
}

export function hasCafePreparationTime(
  date: string,
  time: string,
  now = new Date()
) {
  const timestamp = new Date(`${date}T${time}:00+04:00`).getTime();
  const readyAt = getCafePreparationReadyAt(now);

  return Number.isFinite(timestamp) && timestamp >= readyAt;
}

export function getEarliestCafeVisitTime(now = new Date()) {
  const readyAt = new Date(getCafePreparationReadyAt(now));

  if (getTodayInSamara(readyAt) !== getTodayInSamara(now)) {
    return null;
  }

  const readyTime = getTimeInSamara(readyAt);
  const earliestTime =
    readyTime < CAFE_OPEN_TIME ? CAFE_OPEN_TIME : readyTime;

  return earliestTime <= CAFE_CLOSE_TIME ? earliestTime : null;
}
