import { Routes, ComponentType } from "discord.js";
import { modalSubmit } from "../../bot/interactions/modalSubmit/index"

export const modal = async (
  { data, application_id, token, member, channel_id, guild_id, message },
  { logger, rest, documentClient }
) => {
  logger.log("info", "modal submit", {
    data,
  });

  const handlerResponse = await modalSubmit(data, {
    logger,
    rest,
    documentClient,
    interactionConfig: {
      application_id,
      token,
      member,
      guild_id,
      channel_id,
      message,
    },
  });
  const responseResult = await rest.patch(
    (Routes as any).webhookMessage(application_id, token),
    handlerResponse || {
      body: {
        content: "Unknown Interaction",
      },
    }
  );
  return responseResult;
};
