import {
  APIInteractionGuildMember,
  ApplicationCommandType,
  REST,
  APIChatInputApplicationCommandInteractionData,
} from "discord.js";
import { Logger } from "winston";
import { requestRoleCommand } from "./role";
import { inviteLinkCommand} from "./inviteLink"
import { buildCommand } from "./builds";
import { profileCommand } from "./profile";
import { serverProfileCommand } from "./serverProfile"
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

export const commandName_request = "request";
export const availableSubCommands = {
  role: requestRoleCommand,
  invite_link: inviteLinkCommand,
  build: buildCommand,
  profile: profileCommand,
  server_profile: serverProfileCommand,
};
export const recognizedSubCommands = Object.keys(availableSubCommands);
export const requestCommand = async (
  data: APIChatInputApplicationCommandInteractionData & { type: number },
  factoryInits: factoryInitializations
) => {
  const { logger, rest, interactionConfig } = factoryInits;
  logger.log("info", `command - ${commandName_request}`, { data });
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
