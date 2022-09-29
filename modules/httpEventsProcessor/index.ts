import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { Logger } from "winston";
import { startBot } from "../../bot";
import { verifyRequest } from "../../bot/interactions/verify";
import { SQS } from "@aws-sdk/client-sqs";

/**
 * A simple function that returns the request.
 *
 * @param {APIGatewayProxyEvent} event - Api Gateway standard event
 * @param {Context} context - Context to the event
 * @returns returns a confirmation to the message to the
 */
export const httpEventsHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  factory: { logger: Logger; config: any; sqsClient: SQS }
): Promise<APIGatewayProxyResult> => {
  const { logger, config, sqsClient } = factory;
  logger.log("info", "Event recieved", event);
  const verifyResponse = verifyRequest(event, factory);
  const isValidDiscordInteraction: boolean = !!verifyResponse;
  const isEmptyEventBody = event.body == null && event.body == undefined;
  const eventBody = !isEmptyEventBody ? (event.body as string) : "";
  const strBody = event.isBase64Encoded
    ? Buffer.from(eventBody, "base64").toString("utf8")
    : eventBody;
  const parsedEventBody = JSON.parse(strBody);
  try {
    const sqsSendResult = isValidDiscordInteraction
      ? await sqsClient.sendMessage({
          QueueUrl: config.DISCORD_EVENTS_SQS,
          MessageBody: strBody,
          MessageGroupId: parsedEventBody.guild_id,
        })
      : false;

    logger.log("info", "Event queued", {
      config,
      parsedEventBody,
      sqsSendResult,
      MessageGroupId: parsedEventBody?.guild_id,
    });
    return (
      verifyResponse || {
        statusCode: 200,
        body: JSON.stringify({
          affirmation: "recieved",
          requestBodyEcho: eventBody,
        }),
      }
    );
  } catch (sqsError) {
    logger.log("error", "SQS - Queue failed", { config, strBody, sqsError });
    return {
      statusCode: 500,
      body: JSON.stringify(sqsError),
    };
  }
};

/**
 * A factory function to initialize and
 * return a wrapped main function with the initialized
 * variables passed on
 * */

export const httpEventsFactoryHandler = (config: any) => {
  const { getLogger } = startBot();
  const logger = getLogger();
  const sqsClient = new SQS({});

  return (event, context) =>
    httpEventsHandler(event, context, { logger, config, sqsClient }) as any;
};
