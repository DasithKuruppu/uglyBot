import { startBot } from "../../bot";
import { REST } from "@discordjs/rest";
import { InteractionType } from "discord.js";
import { APIInteraction } from "discord-api-types/v10";
import { getEnvironmentVariables } from "../../bot/configs";
import { createEvent } from "./create";
import warmer from "lambda-warmer";
import { SQSRecordAttributes } from "aws-lambda";
export const discordScheduleInteractionEventHandler = {
  [InteractionType.ApplicationCommand]: createEvent,
};
export const supportedInteractionTypes = Object.keys(
  discordScheduleInteractionEventHandler
);
export const discordScheduleEventsProcessingFunction = async (
  event: AWSLambda.SQSEvent,
  { logger, rest }
) => {
  const { Records = [] } = event;
  const interactionData = Records.map(({ body, attributes }) => {
    const bodyData = JSON.parse(body);
    return { ...bodyData, awsAttributes: attributes };
  }) as (APIInteraction & { awsAttributes: SQSRecordAttributes })[];
  const supportedInteractions = ({ type }) =>
    supportedInteractionTypes.includes(String(type));
  const interactionResponses = interactionData
    .filter(supportedInteractions)
    .map(
      async ({
        awsAttributes,
        application_id,
        token,
        guild_id,
        data,
        member,
        channel_id,
        type,
        message,
      }) => {
        const responseResult = await discordScheduleInteractionEventHandler[
          type
        ](
          {
            data,
            application_id,
            guild_id,
            token,
            member,
            channel_id,
            message,
            awsAttributes,
          },
          { logger, rest }
        );
        return responseResult;
      }
    );
  const interactionScheduleResult = await Promise.all(interactionResponses);
  logger.log("info", "discord parsed interaction data and result", {
    interactionData,
    interactionScheduleResult,
  });
};

export const discordScheduleEventsInteractionFactoryHandler = () => {
  const { getLogger } = startBot();
  const logger = getLogger();
  const { discordBotToken } = getEnvironmentVariables();
  const rest = new REST({ version: "10" }).setToken(discordBotToken);
  return async (event) => {
    logger.log("info", "discord schedule event recieved", event);
    const isWarmerEvent = await warmer(event);
    logger.log("info", "is lambda warmer invocation", { isWarmerEvent });
    if (isWarmerEvent) {
      return "warmed";
    }
    return discordScheduleEventsProcessingFunction(event, { logger, rest });
  };
};
