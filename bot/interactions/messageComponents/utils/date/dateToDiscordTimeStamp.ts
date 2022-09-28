import dayjs from "dayjs-parser/dayjs";

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
