import { startBot } from "../../bot/";
import { REST } from "@discordjs/rest";
import OpenAi from "openai";
import { InteractionType } from "discord.js";
import { APIInteraction } from "discord-api-types/v10";
import { getEnvironmentVariables } from "../../bot/configs";
import { applicationCommands } from "./applicationCommand";
import { messageComponent } from "./messageComponent";
import warmer from "lambda-warmer";
import { modal } from "./modal";
export const discordInteractionEventHandler = {
  [InteractionType.ApplicationCommand]: applicationCommands,
  [InteractionType.MessageComponent]: messageComponent,
  [InteractionType.ModalSubmit]: modal,
};

export const supportedInteractionTypes = Object.keys(
  discordInteractionEventHandler
);

export const discordEventsInteractionFactoryHandler = () => {
  const { getLogger, getDocumentClient } = startBot();
  const logger = getLogger();
  const documentClient = getDocumentClient();
  const { discordBotToken, openAPIKey } = getEnvironmentVariables();
  const rest = new REST({ version: "10" }).setToken(discordBotToken);

  const openAi = new OpenAi({apiKey: openAPIKey});
  return async (event) => {
    logger.log("info", "discord event recieved", event);
    const isWarmerEvent = await warmer(event);
    logger.log("info", "is lambda warmer invocation", { isWarmerEvent });
    if (isWarmerEvent) {
      return "warmed";
    }
    return discordEventsProcessingFunction(event, {
      logger,
      rest,
      documentClient,
      openAi
    });
  };
};

export const discordEventsProcessingFunction = async (
  event: AWSLambda.SQSEvent,
  { logger, rest, documentClient, openAi }
) => {
  const { Records = [] } = event;
  const interactionData = Records.map(({ body }) =>
    JSON.parse(body)
  ) as APIInteraction[];

  logger.log("info", "discord parsed interaction data", interactionData);

  const supportedInteractions = ({ type }) =>
    supportedInteractionTypes.includes(String(type));
  const interactionResponses = interactionData
    .filter(supportedInteractions)
    .map(
      async ({
        application_id,
        token,
        data,
        member,
        channel_id,
        guild_id,
        type,
        message,
      }) => {
        const responseResult = await discordInteractionEventHandler[type](
          {
            data,
            application_id,
            token,
            member,
            channel_id,
            guild_id,
            message,
          },
          { logger, rest, documentClient, openAi }
        );
        return responseResult;
      }
    );
  const interactionResult = await Promise.all(interactionResponses);

  logger.log("info", "interaction response sent", { interactionResult });
};
