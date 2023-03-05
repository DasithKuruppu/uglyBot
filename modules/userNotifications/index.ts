import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBStreamEvent,
  APIGatewayProxyResult,
  Context,
  StreamRecord,
} from "aws-lambda";
import {
  REST,
  RESTPostAPICurrentUserCreateDMChannelResult,
  Routes,
} from "discord.js";
import { Logger } from "winston";
import { startBot } from "../../bot";
import { getEnvironmentVariables } from "../../bot/configs";
import { notificationMapper } from "./types";
/**
 * A simple function that returns the request.
 *
 * @param {APIGatewayProxyEvent} event - Api Gateway standard event
 * @param {Context} context - Context to the event
 * @returns returns a confirmation to the message to the
 */
export const userNotificationsHandler = async (
  event: DynamoDBStreamEvent,
  context: Context,
  factory: { logger: Logger; documentClient: any; rest: REST }
) => {
  const { logger, documentClient, rest } = factory;
  logger.log("info", "Event recieved", event);
  const { Records } = event;
  const allowedEventTypes = ["REMOVE"];
  const dmMessages = Records.filter(
    ({ eventName = "", eventSource = "aws:dynamodb" }) =>
      allowedEventTypes.includes(eventName) && eventSource === "aws:dynamodb"
  ).map(async ({ dynamodb, eventName }) => {
    const { OldImage, NewImage } = dynamodb as StreamRecord;
    const userNotification = unmarshall(
      eventName === "REMOVE" ? (OldImage as any) : (NewImage as any)
    ) as any & {
      discordMemberId: string;
    };
    const { notificationType } = userNotification;
    return await notificationMapper(notificationType, userNotification, {
      logger,
      documentClient,
      rest,
    });
  });
  const result = await Promise.all(dmMessages);
  logger.log("info", "result", { result });
};

export const userNotificationsFactoryHandler = () => {
  const { getLogger, getDocumentClient } = startBot();
  const logger = getLogger();
  const documentClient = getDocumentClient();
  const { discordBotToken } = getEnvironmentVariables();
  const rest = new REST({ version: "10" }).setToken(discordBotToken);
  return async (event, context) => {
    return userNotificationsHandler(event, context, {
      logger,
      documentClient,
      rest,
    });
  };
};
