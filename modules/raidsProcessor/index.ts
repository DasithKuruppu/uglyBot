import {
  DynamoDBStreamEvent,
  APIGatewayProxyResult,
  Context,
  StreamRecord,
} from "aws-lambda";
import { REST, RESTGetAPIChannelMessageResult, Routes } from "discord.js";
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

export const raidsProcessor = async (
  event: DynamoDBStreamEvent,
  context: Context,
  factory: { logger: Logger; documentClient: any; rest: REST }
) => {
  const { logger, documentClient, rest } = factory;
  logger.log("info", "Event recieved", event);
  const { Records } = event;
  const allowedEventTypesCreate = ["INSERT"];
  const allowedEventTypesModify = ["MODIFY"];
  // whenever there is an "MODIFY" update to this we want to check all the user notifications related to this raid and update them too accordingly

  const transactionRecordsCreateEvents = Records.filter(
    ({ eventName = "", eventSource = "aws:dynamodb", dynamodb }) => {
      const { NewImage } = dynamodb as StreamRecord;
      const raidInfo = unmarshall(NewImage as any);
      const {
        title,
        creatorId,
        autorName,
        eventDiscordDateTime,
        isFivePerson,
        description,
        template,
        coverImageUrl,
        type,
        raidEmbed,
        serverId,
        messageId,
        channelId,
        updatedAt,
      } = raidInfo;
      const raidTime = Number(
        eventDiscordDateTime.substring(3, eventDiscordDateTime.length - 3)
      );
      const epochTimeNowInSecs = Math.round(Date.now() / 1000);
      const timeDiff = Number(raidTime) - epochTimeNowInSecs;
      const minQueueMarkTimeSecsDiff = 15 * 60;
      const isMinQueueMarkTimeDiffMet = timeDiff >= minQueueMarkTimeSecsDiff;
      return (
        allowedEventTypesCreate.includes(eventName) &&
        eventSource === "aws:dynamodb"
      );
    }
  ).map(({ dynamodb }) => {
    const { NewImage } = dynamodb as StreamRecord;
    const raidInfo = unmarshall(NewImage as any);
    const {
      title,
      creatorId,
      autorName,
      eventDiscordDateTime,
      isFivePerson,
      description,
      template,
      coverImageUrl,
      type,
      raidId,
      raidEmbed,
      serverId,
      messageId,
      channelId,
      updatedAt,
    } = raidInfo;
    const raidTime = Number(
      eventDiscordDateTime.substring(3, eventDiscordDateTime.length - 3)
    );
    const epochTimeNowInSecs = Math.round(Date.now() / 1000);
    const minQueueMarkTimeSecsDiff = 30 * 60;
    const bufferTimeSecs = 25 * 60;

    const updateValues = setUpdateValues({
      channelId,
      serverId,
      messageId,
      autorName,
      notificationType: NotificationType.channelReminderUser,
      raidTime,
      raidType: type,
      raidTitle: title,
      createdAt: Date.now(),
      notifyTime:
        Number(raidTime) - (minQueueMarkTimeSecsDiff + bufferTimeSecs),
    });
    const upsertRecord = {
      Update: {
        TableName: userNotifcations.name.get(),
        Key: {
          discordMemberId: `created_${creatorId}`,
          raidId: raidId,
        },
        UpdateExpression: updateValues.updateExpression,
        ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
        ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
      },
    };
    return upsertRecord;
  });

  const transactionRecordsModifyEvents = Records.filter(
    ({ eventName = "", eventSource = "aws:dynamodb", dynamodb }) => {
      const { NewImage, OldImage = {} } = dynamodb as StreamRecord;
      const raidInfo = unmarshall(NewImage as any);
      const oldRaidInfo = unmarshall(OldImage as any);
      const {
        title,
        creatorId,
        autorName,
        eventDiscordDateTime,
        isFivePerson,
        description,
        template,
        coverImageUrl,
        type,
        raidEmbed,
        serverId,
        messageId,
        channelId,
        updatedAt,
      } = raidInfo;
      const raidTime = Number(
        eventDiscordDateTime.substring(3, eventDiscordDateTime.length - 3)
      );
      const oldRaidTime = Number(
        oldRaidInfo?.eventDiscordDateTime?.substring(
          3,
          oldRaidInfo?.eventDiscordDateTime.length - 3
        )
      );
      const epochTimeNowInSecs = Math.round(Date.now() / 1000);
      const timeDiff = Number(raidTime) - epochTimeNowInSecs;
      return (
        allowedEventTypesModify.includes(eventName) &&
        eventSource === "aws:dynamodb" &&
        timeDiff >= 0 &&
        oldRaidTime !== raidTime
      );
    }
  ).map(async ({ dynamodb }) => {
    const { NewImage } = dynamodb as StreamRecord;
    const raidInfo = unmarshall(NewImage as any);
    const {
      title,
      creatorId,
      autorName,
      eventDiscordDateTime,
      isFivePerson,
      description,
      template,
      coverImageUrl,
      type,
      raidId,
      raidEmbed,
      serverId,
      messageId,
      channelId,
      updatedAt,
    } = raidInfo;
    const raidTime = Number(
      eventDiscordDateTime.substring(3, eventDiscordDateTime.length - 3)
    );
    const epochTimeNowInSecs = Math.round(Date.now() / 1000);
    const minQueueMarkTimeSecsDiff = 15 * 60;
    const bufferTimeSecs = 25 * 60;
    const raidMessage = (await rest.get(
      (Routes as any).channelMessage(channelId, messageId)
    )) as RESTGetAPIChannelMessageResult;
    logger.log("info", { raidMessage });
    const membersList =
      raidMessage.embeds?.[0].fields
        ?.filter(({ name, value }) => {
          return value.includes("@");
        })
        .map(({ name, value }) => {
          const match = value.match(/<@(\d+)>/);
          return match ? match[1] : "";
        }) || [];
    const updateValuesChannelMsg = setUpdateValues({
      channelId,
      serverId,
      messageId,
      autorName,
      notificationType: NotificationType.channelReminderUser,
      raidTime,
      raidType: type,
      raidTitle: title,
      createdAt: Date.now(),
      notifyTime:
        Number(raidTime) -
        (minQueueMarkTimeSecsDiff + bufferTimeSecs + 20 * 60),
    });
    const upsertRecordChannelMsg = {
      Update: {
        TableName: userNotifcations.name.get(),
        Key: {
          discordMemberId: `created_${creatorId}`,
          raidId: raidId,
        },
        UpdateExpression: updateValuesChannelMsg.updateExpression,
        ExpressionAttributeNames:
          updateValuesChannelMsg.updateExpressionAttributeNames,
        ExpressionAttributeValues:
          updateValuesChannelMsg.updateExpressionAttributeValues,
      },
    };
    const updatableMemberList = membersList?.map((discordMemberId) => {
      const updateValuesUserDM = setUpdateValues({
        channelId,
        serverId,
        notificationType: "raidEventReminder",
        raidTime,
        raidType: type,
        raidTitle: title,
        createdAt: Date.now(),
        notifyTime:
          Number(raidTime) - (minQueueMarkTimeSecsDiff + bufferTimeSecs),
      });
      const upsertRecordUserDM = {
        Update: {
          TableName: userNotifcations.name.get(),
          Key: {
            discordMemberId,
            raidId,
          },
          UpdateExpression: updateValuesUserDM.updateExpression,
          ExpressionAttributeNames:
            updateValuesUserDM.updateExpressionAttributeNames,
          ExpressionAttributeValues:
            updateValuesUserDM.updateExpressionAttributeValues,
        },
      };
      return upsertRecordUserDM;
    });

    return [upsertRecordChannelMsg, ...updatableMemberList];
  });
  const resolvedModifyEventsList = await Promise.all(
    transactionRecordsModifyEvents
  );
  const flatModifiedEventsList = resolvedModifyEventsList.flatMap(
    (updates) => updates
  );
  const paramsForTransaction = {
    TransactItems: [
      ...transactionRecordsCreateEvents,
      ...flatModifiedEventsList,
    ],
  };
  logger.log("info", "transaction", {
    transactionRecordsCreateEvents,
    flatModifiedEventsList,
  });
  const result = await documentClient
    .transactWrite(paramsForTransaction as any)
    .promise();
};

/**
 * A factory function to initialize and
 * return a wrapped main function with the initialized
 * variables passed on
 * */
export const raidsFactoryHandler = () => {
  const { getLogger, getDocumentClient } = startBot();
  const logger = getLogger();
  const documentClient = getDocumentClient();
  const { discordBotToken } = getEnvironmentVariables();
  const rest = new REST({ version: "10" }).setToken(discordBotToken);
  return async (event, context) => {
    return raidsProcessor(event, context, {
      logger,
      documentClient,
      rest,
    });
  };
};
