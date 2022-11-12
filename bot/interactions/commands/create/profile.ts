import {
    APIChatInputApplicationCommandInteractionData,
    REST,
    Routes,
    APIInteractionGuildMember,
    APIApplicationCommandInteractionDataSubcommandOption,
  } from "discord.js";
  
  import { Logger } from "winston";
  import { userProfile } from "../../../modals/profile";
  
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
  
  export const profileCommand = async (
    data: APIChatInputApplicationCommandInteractionData,
    factoryInits: factoryInitializations
  ) => {
    const { rest, logger, interactionConfig } = factoryInits;
    const [{ type: subCommandType, options: subCommandOptions = [] }] =
      data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  
    return false;
  };
  