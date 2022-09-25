import {
  APIInteractionGuildMember,
  ApplicationCommandType,
  REST,
  APIChatInputApplicationCommandInteractionData,
} from "discord.js";
import { Logger } from "winston";
import { createRaidCommand } from "./raid";
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

export const commandName_create = "create";
export const availableSubCommands = {
  raid: createRaidCommand,
};
export const recognizedSubCommands = Object.keys(availableSubCommands);
export const createCommand = async (
  data: APIChatInputApplicationCommandInteractionData & { type: number },
  factoryInits: factoryInitializations
) => {
  const { logger, rest, interactionConfig } = factoryInits;
  logger.log("info", `command - ${commandName_create}`, { data });
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
