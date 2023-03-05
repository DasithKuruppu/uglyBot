import {
  DynamoDBStreamEvent,
  APIGatewayProxyResult,
  Context,
  StreamRecord,
} from "aws-lambda";
import { REST } from "discord.js";
import { Logger } from "winston";
import { startBot } from "../../bot";
import { getEnvironmentVariables } from "../../bot/configs";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  ACTIVITY_STATUS,
  IMemberActionsUpdates,
} from "../../bot/interactions/messageComponents/utils/storeOps/memberActions";
import { userNotifcations } from "../../pulumi/persistantStore/tables/userNotifications";
import { setUpdateValues } from "../../bot/store/utils";
import { NotificationType } from "../userNotifications/types";
/**
 * A simple function that returns the request.
 *
 * @param {APIGatewayProxyEvent} event - Api Gateway standard event
 * @param {Context} context - Context to the event
 * @returns returns a confirmation to the message to the
 */
export const userActionsHandler = async (
  event: DynamoDBStreamEvent,
  context: Context,
  factory: { logger: Logger; documentClient: any; rest: REST }
) => {
  const { logger, documentClient } = factory;
  logger.log("info", "Event recieved", event);
  const { Records } = event;
  const allowedEventTypes = ["MODIFY", "INSERT"];
  const transactionRecords = Records.filter(
    ({ eventName = "", eventSource = "aws:dynamodb", dynamodb }) => {
      const { NewImage } = dynamodb as StreamRecord;
      const userAction = unmarshall(NewImage as any) as IMemberActionsUpdates & {
        discordMemberId: string;
      };
      const {
        raidTime,
        raidId,
        raidTitle,
        raidType,
        discordMemberId,
        status,
        serverId,
        channelId,
        createdAt,
      } = userAction;
      const epochTimeNowInSecs = Math.round(Date.now() / 1000);
      const timeDiff = Number(raidTime) - epochTimeNowInSecs;
      const minQueueMarkTimeSecsDiff = 15 * 60;
      const isMinQueueMarkTimeDiffMet = timeDiff >= minQueueMarkTimeSecsDiff;
      return (
        allowedEventTypes.includes(eventName) && eventSource === "aws:dynamodb" && isMinQueueMarkTimeDiffMet
      );
    }
  ).map(({ dynamodb }) => {
    const { NewImage } = dynamodb as StreamRecord;
    const userAction = unmarshall(NewImage as any) as IMemberActionsUpdates & {
      discordMemberId: string;
    };
    const {
      raidTime,
      raidId,
      raidTitle,
      raidType,
      discordMemberId,
      status,
      serverId,
      channelId,
      createdAt,
    } = userAction;
    const epochTimeNowInSecs = Math.round(Date.now() / 1000);
    const minQueueMarkTimeSecsDiff = 15 * 60;
    const bufferTimeSecs = 25 * 60;
    const userJoined = [
      ACTIVITY_STATUS.JOINED,
      ACTIVITY_STATUS.JOINED_ARTIFACT_SELECT,
      ACTIVITY_STATUS.JOINED_CLASS_SELECT,
      ACTIVITY_STATUS.JOINED_WAITLIST,
    ].includes(status);

    const updateValues = setUpdateValues({
      channelId,
      serverId,
      notificationType: "raidEventReminder",
      raidTime,
      raidType,
      raidTitle,
      createdAt: Date.now(),
      notifyTime: Number(raidTime) - (minQueueMarkTimeSecsDiff + bufferTimeSecs),
    });

    const deleteRecordValues = setUpdateValues({
      channelId,
      serverId,
      notificationType: NotificationType.userLeft,
      raidTime,
      raidType,
      raidTitle,
      createdAt: Date.now(),
      notifyTime: Number(raidTime) - (minQueueMarkTimeSecsDiff + bufferTimeSecs),
    });
    const upsertRecord = {
      Update: {
        TableName: userNotifcations.name.get(),
        Key: {
          discordMemberId,
          raidId,
        },
        UpdateExpression: updateValues.updateExpression,
        ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
        ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
      },
    };

    const userLeftRecord = {
      Update: {
        Update: {
          TableName: userNotifcations.name.get(),
          Key: {
            discordMemberId,
            raidId,
          },
          UpdateExpression: deleteRecordValues.updateExpression,
          ExpressionAttributeNames: deleteRecordValues.updateExpressionAttributeNames,
          ExpressionAttributeValues: deleteRecordValues.updateExpressionAttributeValues,
        },
      },
    };
    return userJoined ? upsertRecord : userLeftRecord;
  });
  const paramsForTransaction = {
    TransactItems: transactionRecords,
  };
  logger.log("info", "transaction", { transactionRecords });
  const result = await documentClient
    .transactWrite(paramsForTransaction as any)
    .promise();
};

/**
 * A factory function to initialize and
 * return a wrapped main function with the initialized
 * variables passed on
 * */
export const userActionsFactoryHandler = () => {
  const { getLogger, getDocumentClient } = startBot();
  const logger = getLogger();
  const documentClient = getDocumentClient();
  const { discordBotToken } = getEnvironmentVariables();
  const rest = new REST({ version: "10" }).setToken(discordBotToken);
  return async (event, context) => {
    return userActionsHandler(event, context, {
      logger,
      documentClient,
      rest,
    });
  };
};
