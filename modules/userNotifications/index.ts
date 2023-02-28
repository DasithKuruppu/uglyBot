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
import { getRaid } from "../../bot/interactions/messageComponents/utils/storeOps/fetchData";
import { userReminderEmbed } from "../../bot/embeds/templates/userReminder/userReminder";
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
    const {
      discordMemberId,
      raidTime,
      raidTitle,
      raidId,
      raidType,
      notifyTime,
      serverId,
      channelId,
      createdAt,
    } = userNotification;
    const epochTimeNowInSecs = Math.round(Date.now() / 1000);
    const dmChannelInfo = (await rest.post((Routes as any).userChannels(), {
      body: { recipient_id: discordMemberId },
    })) as RESTPostAPICurrentUserCreateDMChannelResult;
    logger.log("info", "dmChannelInfo", {
      dmChannelInfo,
      notifyTime,
      epochTimeNowInSecs,
      timeDiff: notifyTime - epochTimeNowInSecs
    });
    const { id } = dmChannelInfo;

    const raidInfo = await getRaid({ raidId }, { documentClient });
    const raidUrl = `https://discord.com/channels/${serverId}/${channelId}/${raidInfo.messageId}`;
    const userEmbedMsg = userReminderEmbed({
      description: `You signed up for a raid - [${raidTitle}](${raidUrl}) which is about to start <t:${raidTime}:R>.`,
    });
    const sentMessage = await rest.post((Routes as any).channelMessages(id), {
      body: {
        content: "",
        embeds: [userEmbedMsg],
      },
    });
    return sentMessage;
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
