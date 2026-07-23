export const CAFE_OPEN_TIME = "11:00";
export const CAFE_CLOSE_TIME = "23:00";

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

export function isFutureSamaraVisit(date: string, time: string) {
  const timestamp = new Date(`${date}T${time}:00+04:00`).getTime();
  return Number.isFinite(timestamp) && timestamp > Date.now();
}
