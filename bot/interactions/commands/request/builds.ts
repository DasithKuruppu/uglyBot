import {
  APIChatInputApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataRoleOption,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
  APIApplicationCommandInteractionDataSubcommandOption,
  APIApplicationCommandInteractionDataUserOption,
  APIApplicationCommandInteractionDataStringOption,
} from "discord.js";

import { Logger } from "winston";
import { infoCardBuilder } from "../../../embeds/templates/neverwinter/infoCard";

interface factoryInitializations {
  logger: Logger;
  rest: REST;
  interactionConfig: {
    guild_id: string;
    application_id: string;
    token: string;
    member: APIInteractionGuildMember;
  };
}

export const buildCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: factoryInitializations
) => {
  const { rest, logger, interactionConfig } = factoryInits;
  const [{ type: subCommandType, options: subCommandOptions = [] }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const userId = subCommandOptions.find(({ name }) => name === "user")?.value;
  const buildType = subCommandOptions.find(
    ({ name }) => name === "type"
  )?.value;
  if (
    subCommandType !== ApplicationCommandOptionType.Subcommand ||
    !userId ||
    !buildType
  ) {
    return {
      body: {
        content: "Unsupported input",
      },
    };
  }
  if(userId !== "320419663349678101"){
    return {
      body: {
        content: "There is no builds specified for this user",
      },
    };
  }

  const buildData = infoCardBuilder({});
  return {
    body: {
      ...buildData,
      content: `Requested builds of <@${userId}>`,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};
