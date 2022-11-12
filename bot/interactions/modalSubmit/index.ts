import {
  APIInteractionGuildMember,
  ApplicationCommandType,
  REST,
  APIChatInputApplicationCommandInteractionData,
} from "discord.js";
import { Logger } from "winston";
import { unrecognizedCommand } from "../commands";
import { userProfile } from "./userProfile";
interface factoryInitializations {
  logger: Logger;
  rest: REST;
  documentClient: any,
  interactionConfig: {
    application_id: string;
    token: string;
    guild_id: string;
    member: APIInteractionGuildMember;
    channel_id: string;
    message: string;
  };
}

export const availableModalSubmits = {
  user_profile: userProfile,
};
export const recognizedSubCommands = Object.keys(availableModalSubmits);
export const modalSubmit = async (
  data: APIChatInputApplicationCommandInteractionData & { type: number },
  factoryInits: factoryInitializations
) => {
  const { logger, rest, interactionConfig } = factoryInits;
  logger.log("info", `submission`, { data });
  const { options, type } = data;
  const [{ name = "" } = {}] = options || [];
  const subCommandResult = recognizedSubCommands.includes(name)
    ? await availableModalSubmits[name](data, factoryInits)
    : {
        body: {
          content: "Unknown submission",
        },
      };

  return subCommandResult;
};
