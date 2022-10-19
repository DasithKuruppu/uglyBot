import dayjs from "dayjs";
import dayjsParser from "dayjs-parser";

dayjs.extend(dayjsParser);

export const convertToDiscordDate = (date: string, { long = true, relative = false } = {}) => {
  const dateConvertible = dayjs(date).unix();
  if(dateConvertible === NaN){
    return `{invalid time format}`
  }
  if(relative) {
    return `<t:${dateConvertible}:R>`;
  }
  return `<t:${dateConvertible}:F>`;
};
