import { convertToDiscordDate } from "../date/dateToDiscordTimeStamp";
export const createRaidContent = (
  previousText = "",
  {
    eventDate = undefined,
    userActionText = "",
  }: { eventDate?: string; userActionText?: string }
) => {
  const [extractEventDateText] = previousText.split("\n");
  const eventDateIsValid = extractEventDateText.includes("Event/Raid");
  const processedEventDate = eventDate
    ? `Event/Raid will start at ${convertToDiscordDate(eventDate)}`
    : eventDateIsValid
    ? extractEventDateText
    : "";

  return `${processedEventDate}\nLast activity(${convertToDiscordDate("now", {
    relative: true,
  })}) :\n${userActionText}`;
};
