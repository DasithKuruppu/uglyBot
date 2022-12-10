import dayjs from "dayjs";
import dayjsParser from "dayjs-parser";

dayjs.extend(dayjsParser);

export const convertToDiscordDate = (date: string, { long = true, relative = false } = {}) => {
  const dateConvertible = dayjs(date).unix();
  if(Number.isNaN(dateConvertible)){
    const assumedTime = dayjs().add(2, 'minutes').unix()
    return  relative ? `<t:${assumedTime}:R>` : `<t:${assumedTime}:F>`;
  }
  if(relative) {
    return `<t:${dateConvertible}:R>`;
  }
  return `<t:${dateConvertible}:F>`;
};
