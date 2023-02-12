import {
  APIChatInputApplicationCommandInteractionData,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
  APIApplicationCommandInteractionDataSubcommandOption,
  RESTGetAPIChannelMessageResult,
} from "discord.js";

import { Logger } from "winston";
import {
  getNewClassOptionsList,
  getOptionsList,
} from "../../../embeds/templates/neverwinter/classesList";
import {
  profileBuilder,
  UserStatusValues,
} from "../../../embeds/templates/neverwinter/profile";
import { raidSummaryBuilder } from "../../../embeds/templates/raidSummary/raidSummary";
import { convertToDiscordDate } from "../../messageComponents/utils/date/dateToDiscordTimeStamp";
import { displayArtifactAsEmoji } from "../../messageComponents/utils/helper/artifactsRenderer";
import { fieldSorter } from "../../messageComponents/utils/helper/artifactsSorter";
import {
  createFieldName,
  defaultJoinStatus,
  statusSymbols,
} from "../../messageComponents/utils/helper/embedFieldAttribute";
import { getUpcomingWeekRaids } from "../../messageComponents/utils/storeOps/fetchData";
import { IfactoryInitializations } from "../../typeDefinitions/event";
import { getAvailableUpcomingWeekRaids } from "../../utils/util";

export const raidSummaryCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const { rest, logger, interactionConfig, documentClient } = factoryInits;
  const [{ type: subCommandType, options: subCommandOptions = [] }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const processedUpcomingRaids = await getAvailableUpcomingWeekRaids({
    serverId: interactionConfig.guild_id,
    documentClient,
    rest,
    logger,
  });
  logger.log("info", "processed raids", { processedUpcomingRaids });
  const buildData = raidSummaryBuilder({
    userId: interactionConfig.member.user.id,
    raidsList: processedUpcomingRaids,
  });

  return {
    body: {
      ...buildData,
      content: ``,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};
