import {
  APIChatInputApplicationCommandInteractionData,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
  APIApplicationCommandInteractionDataSubcommandOption,
} from "discord.js";
import {
  getUserAvailability,
  removeUserAvailability,
  updateUserAvailability,
} from "../../messageComponents/utils/storeOps/userAvailability";
import { Logger } from "winston";
import { availabilityBuilder } from "../../../embeds/templates/neverwinter/availabilityBuilder";
import { IfactoryInitializations } from "../../typeDefinitions/event";
import {
  dayOfWeekAsString,
  normalizeTime,
} from "../../messageComponents/utils/date/dateToDiscordTimeStamp";
import { getUserProfile } from "../../messageComponents/utils/storeOps/userProfile";

export const updateUserAvailabilityCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const { rest, logger, interactionConfig, documentClient } = factoryInits;
  const [{ type: subCommandType, options: subCommandOptions = [] }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const userId =
    (subCommandOptions.find(({ name }) => name === "user")?.value as string) ||
    (interactionConfig?.member.user.id as string);
  const resolvedMembers = data.resolved?.users || {};
  const member = resolvedMembers?.[userId]
    ? { user: resolvedMembers?.[userId] }
    : interactionConfig?.member;
  const userName = member?.user.username;
  const availableDay = subCommandOptions.find(({ name }) => name === "day")
    ?.value as string;
  const availableStartTime = subCommandOptions.find(
    ({ name }) => name === "start_time"
  )?.value as string;
  const availableDuration = subCommandOptions.find(
    ({ name }) => name === "number_of_hours"
  )?.value as string;

  const [userProfile, userAvailability] = await Promise.all([
    getUserProfile({ discordMemberId: userId }, { documentClient }),
    getUserAvailability(userId, { documentClient }),
  ]);
  const offSet = userProfile?.timezoneOffset || "GMT+0:00";
  const normalizedDate = normalizeTime(
    `${availableDay} ${availableStartTime}`,
    { offSet }
  );
  const normalizedDay = normalizedDate.getUTCDay();
  const normalizedHours = normalizedDate.getUTCHours();
  const normalizedMins =
    normalizedDate.getUTCMinutes() == 0 ? "00" : normalizedDate.getUTCMinutes();
  const normalizeDayAsString = dayOfWeekAsString(normalizedDay);
  const foundCurrentRecord = userAvailability.find(({ availableDayUTC }) => {
    return availableDayUTC === normalizeDayAsString;
  });
  logger.log("info", "UserAvailability", {
    foundCurrentRecord,
    userAvailability,
  });
  const deleteRecord = foundCurrentRecord && Number(availableDuration) == 0;
  if (deleteRecord) {
    const removedRecord = await removeUserAvailability(
      { discordMemberId: userId, day: normalizeDayAsString },
      { documentClient }
    );
    logger.log("info", {
      removedRecord,
    });
  } else {
    const updatedUserAvailability = await updateUserAvailability(
      {
        discordMemberId: userId,
        updates: {
          availableDayUTC: normalizeDayAsString,
          availableStartTimeUTC: `${normalizedHours}:${normalizedMins}`,
          availableDuration: availableDuration,
        },
      },
      { documentClient }
    );
    logger.log("info", {
      subCommandOptions,
      member,
      updatedUserAvailability,
    });
  }
  const epochTime = Math.floor(normalizedDate.getTime() / 1000);

  const startTime = epochTime;
  const endTime = epochTime + Number(availableDuration) * 60 * 60;

  return {
    body: {
      content: deleteRecord
        ? `Deleted availability of <@${userId}> from <t:${startTime}:F>`
        : `Updated availability of <@${userId}> from > <t:${startTime}:F> to <t:${endTime}:t>`,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};
