import {
  APIInteractionGuildMember,
  ApplicationCommandType,
  REST,
  APIChatInputApplicationCommandInteractionData
} from "discord.js";
import { Logger } from "winston";
import { requestRoleCommand } from "./role";
import { unrecognizedCommand } from "..";
interface factoryInitializations {
  logger: Logger;
  rest: REST;
  interactionConfig: {
    application_id: string;
    token: string;
    member: APIInteractionGuildMember;
  };
}

export const recognizedSubCommands = ["role"];
export const requestCommand = async (
  data: APIChatInputApplicationCommandInteractionData & { type: number },
  factoryInits: factoryInitializations
) => {
  const { logger, rest, interactionConfig } = factoryInits;
  logger.log("info", "command - request", { data });
  const availableSubCommands = {
    role: requestRoleCommand,
  };
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
