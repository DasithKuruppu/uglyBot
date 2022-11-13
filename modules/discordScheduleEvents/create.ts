import { Routes } from "discord.js";
import {
  commandName_create,
  availableSubCommands,
} from "../../bot/interactions/commands/create";
import dayjs from "dayjs-parser/dayjs";
import { defaultImage } from "./defaultImage";

export const createEvent = async (
  { data, application_id, token, member, channel_id, guild_id, awsAttributes },
  { logger, rest }
) => {
  const { options = [], type, name: commandName } = data;
  const [{ name: subCommandName = "", options: subCommandOptions = [] } = {}] =
    options || [];
  const subCommandList = Object.keys(availableSubCommands);
  const allowedCommandType = [commandName_create];
  const allowedSubCommandType = subCommandList;
  const isAllowedCommand = allowedCommandType.includes(commandName);
  const isAllowedSubCommand = allowedSubCommandType.includes(subCommandName);

  const createOptions = options?.[0];
  const raidOptions = createOptions?.options || [];

  const title =
    raidOptions.find(({ name }) => name === "name")?.value || "Untitled";
  const raidType = raidOptions.find(({ name }) => name === "type")?.value || "";
  const guildEventCreate = raidOptions.find(
    ({ name }) => name === "enable_event"
  )?.value;
  const durationHours =
    raidOptions.find(({ name }) => name === "duration")?.value || 1;
  const description =
    raidOptions.find(({ name }) => name === "description")?.value || "";

  const dateTime = raidOptions.find(({ name }) => name === "date")?.value || "";
  const eventDate = dayjs(dateTime);
  const eventStartDate = eventDate.toISOString();
  const eventEndDate = eventDate.add(durationHours, "hour").toISOString();
  const shouldCreateEvent =
    (guildEventCreate == undefined ? true : guildEventCreate) &&
    isAllowedCommand &&
    isAllowedSubCommand;
  logger.log("info", "Event schedule details", {
    commandName,
    subCommandName,
    isAllowedCommand,
    isAllowedSubCommand,
    shouldCreateEvent,
    eventStartDate,
    eventEndDate,
  });

  const createdEvent =
    shouldCreateEvent &&
    (await rest.post((Routes as any).guildScheduledEvents(guild_id), {
      body: {
        name: `${title}-${raidType}`,
        privacy_level: 2, //guild members only
        scheduled_start_time: eventStartDate,
        scheduled_end_time: eventEndDate,
        description: description,
        entity_type: 3,
        entity_metadata: {
          location: `<#${channel_id}>`,
        },
        image: defaultImage,
      },
    }));

  logger.log("info", "interaction Command Response", {
    options,
    createdEvent,
  });
  return createdEvent;
};
