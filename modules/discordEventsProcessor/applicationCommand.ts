import { Routes } from "discord.js";
import {
  commandActions,
  recognizedCommands,
  unrecognizedCommand,
} from "../../bot/interactions/commands";

export const applicationCommands = async (
  { data, application_id, token, member, guild_id, channel_id },
  { logger, rest, documentClient, openAi }
) => {
  const commandResponse = recognizedCommands.includes(data.name)
    ? await commandActions[data.name](data, {
        logger,
        rest,
        documentClient,
        openAi,
        interactionConfig: {
          application_id,
          token,
          guild_id,
          member,
          channel_id,
        },
      })
    : unrecognizedCommand();

  logger.log("info", "interaction Command Response", {
    commandName: data.name,
    commandResponse,
  });
  const responseResult = commandResponse
    ? await rest.patch(
        (Routes as any).webhookMessage(application_id, token),
        commandResponse
      )
    : false;
  return responseResult;
};
