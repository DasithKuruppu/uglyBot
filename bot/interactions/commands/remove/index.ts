import {
    APIInteractionGuildMember,
    ApplicationCommandType,
    REST,
    APIChatInputApplicationCommandInteractionData,
  } from "discord.js";
  import { Logger } from "winston";
  import { removeRaidUserCommand } from "./raidUser";
  import { unrecognizedCommand } from "..";
  interface factoryInitializations {
    logger: Logger;
    rest: REST;
    interactionConfig: {
      application_id: string;
      token: string;
      member: APIInteractionGuildMember;
      channel_id: string,
    };
  }
  
  export const commandName_remove = "remove";
  export const availableSubCommands = {
    raid_user: removeRaidUserCommand,
  };
  export const recognizedSubCommands = Object.keys(availableSubCommands);
  export const removeCommand = async (
    data: APIChatInputApplicationCommandInteractionData & { type: number },
    factoryInits: factoryInitializations
  ) => {
    const { logger, rest, interactionConfig } = factoryInits;
    logger.log("info", `command - ${commandName_remove}`, { data });
    const { options, type } = data;
    const [{ name = "" } = {}] = options || [];
    if (type !== ApplicationCommandType.ChatInput) {
      return {
        body: {
          content: "Unsupported input used",
        },
      };
    }
    const subCommandResult = recognizedSubCommands.includes(name)
      ? await availableSubCommands[name](data, factoryInits)
      : unrecognizedCommand();
  
    return subCommandResult;
  };
  