import { Routes, ComponentType } from "discord.js";
import {
  raidSelectMenusInteractions,
} from "../../bot/interactions/messageComponents/selectMenu";
import {
  raidButtonInteractions,
} from "../../bot/interactions/messageComponents/buttons"
export const messageComponent = async (
  { data, application_id, token, member, channel_id, guild_id, message },
  { logger, rest, documentClient }
) => {
  logger.log("info", "message component", {
    data,
  });

  const componentTypeHandler = {
    [ComponentType.SelectMenu]: raidSelectMenusInteractions,
    [ComponentType.Button]: raidButtonInteractions,
  };
  const handlerResponse = await componentTypeHandler[data.component_type](data, {
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
