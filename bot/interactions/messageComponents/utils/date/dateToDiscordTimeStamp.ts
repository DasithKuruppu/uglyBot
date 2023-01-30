import dayjs from "dayjs";
import * as chrono from 'chrono-node';
import dayjsParser from "dayjs-parser";

dayjs.extend(dayjsParser);

export const normalizeTime = (inputDate, { offSet = "GMT-05:00" } = {}) => {
  const listOfTimeZoneExclusives = [
    /\s[A-Za-z]{3}[+,-]\d{1,2}:\d{0,2}/,
    /\s[A-Za-z]{3}[+,-]\d{1,4}/,
    /\s[+,-]\d{1,4}/,
    /\s[+,-]\d{0,4}/,
    /\s[+,-]\d{1,2}:\d{1,2}/,
    "MST",
    "GMT",
    "UTC",
    "Eastern Daylight Time",
    /hours/i,
    /minutes/i,
    /days/i,
    /weeks/i,
    /months/i
  ];
  const containsTimeZone = listOfTimeZoneExclusives.reduce((prev, current) => {
    return prev || (inputDate.indexOf(current) >= 0);
  }, false);
  return containsTimeZone ? inputDate : chrono.parseDate(`${inputDate} ${offSet}`);
};

export const convertToDiscordDate = (
  date: string,
  { long = true, relative = false, offset = 0 } = {}
) => {
  const dateConvertible = dayjs(date).unix();
  if (Number.isNaN(dateConvertible)) {
    const assumedTime = dayjs().add(2, "minutes").unix();
    return relative ? `<t:${assumedTime}:R>` : `<t:${assumedTime}:F>`;
  }
  if (relative) {
    return `<t:${dateConvertible}:R>`;
  }
  return `<t:${dateConvertible}:F>`;
};
