import dayjs from "dayjs-parser/dayjs";

export const convertToDiscordDate = (date: string, { long = true } = {}) => {
  const dateConvertible = dayjs(date).unix();
  if(dateConvertible === NaN){
    return `{invalid time format}`
  }
  return `<t:${dateConvertible}:F>`;
};
