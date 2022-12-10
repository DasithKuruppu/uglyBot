import dayjs from "dayjs-parser/dayjs";
import {
  APIChatInputApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataRoleOption,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
  RESTPostAPIChannelInviteJSONBody,
  RESTPostAPIChannelInviteResult,
  APIApplicationCommandInteractionDataSubcommandOption,
  RESTGetAPIChannelMessageResult,
  RESTPostAPIChannelMessageResult,
} from "discord.js";
import { Logger } from "winston";
import { raidsTable } from "../../../../pulumi/persistantStore/tables/raids";
import { raidConfigs } from "../../../embeds/templates/neverwinter/config";
import { availableSlotValue } from "../../../embeds/templates/neverwinter/raid";
import { setUpdateValues } from "../../../store/utils";
import {
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../messageComponents/utils/categorizeEmbedFields/categorizeEmbedFields";
import { defaultJoinStatus } from "../../messageComponents/utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
} from "../../messageComponents/utils/helper/raid";
import { getRaid } from "../../messageComponents/utils/storeOps/fetchData";
import { IfactoryInitializations } from "../../typeDefinitions/event";

export const removeRaidUserCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const { rest, logger, documentClient, interactionConfig } = factoryInits;
  const { guild_id, channel_id } = interactionConfig;
  const [{ type, options, name }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const [{ type: subCommandType, options: subCommandOptions = [] }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const userId = subCommandOptions.find(({ name }) => name === "user")?.value;
  const raidId = subCommandOptions.find(({ name }) => name === "raid_id")
    ?.value as string;
  const reason = subCommandOptions.find(({ name }) => name === "reason")?.value;
  const creatorId = interactionConfig.member?.user?.id;
  const raidRecord = await getRaid({ raidId, creatorId }, { documentClient });
  logger.log("info", { raidRecord, creatorId, raidId });
  const raidChannelId = raidRecord?.channelId;
  const raidMessageId = raidRecord?.messageId;
  if (!raidChannelId || !raidMessageId) {
    return {
      body: {
        content: `No record for this raid exists or you are not the creator of this raid. 
        Unable to remove user <@${userId}>`,
        allowed_mentions: {
          parse: [],
        },
      },
    };
  }
  const findRaidMessage = (raidRecord &&
    (await rest.get(
      (Routes as any).channelMessage(raidChannelId, raidMessageId)
    ))) as RESTGetAPIChannelMessageResult;
  if (!findRaidMessage) {
    return {
      body: {
        content: `Could not find the raid message accociated with this raid Id. 
          Unable to remove user <@${userId}>`,
        allowed_mentions: {
          parse: [],
        },
      },
    };
  }
  const { content, embeds, components } = findRaidMessage;
  const [previousPendingUpdate] = JSON.parse(
    raidRecord?.pendingUpdates || "[]"
  ).slice(-1);
  const [currentEmbed] = raidRecord?.hasPendingUpdates
    ? previousPendingUpdate?.embeds
    : embeds;
  const { templateId } = determineRaidTemplateType({
    embedFields: currentEmbed?.fields || [],
  });
  const sectionSeperation = raidConfigs[templateId];
  const seperatedSections = getEmbedFieldsSeperatedSections(
    currentEmbed.fields || [],
    sectionSeperation
  );
  logger.log("info", "remove raid user", { findRaidMessage, raidRecord });
  const [
    {
      userArtifacts = "",
      userExists = false,
      userStatus = defaultJoinStatus,
      userRecord = {},
      sectionName = Category.WAITLIST,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, userId as string);
  if (!userExists) {
    return {
      body: {
        content: `Could not find this user <@${userId}> on the embed`,
        allowed_mentions: {
          parse: [],
        },
      },
    };
  }

  const { updatedFieldsList, updatedSections } = determineActions(
    seperatedSections,
    {
      memberId: userId as string,
      requestedUserSection: sectionName,
      userField: {
        inline: true,
        name: sectionName,
        value: availableSlotValue,
      },
      factoryInits,
      defaultSeperation: sectionSeperation,
      userRemove: true,
    }
  );
  const messageEmbedData = {
    embeds: [{ ...currentEmbed, fields: updatedFieldsList }],
    components,
  };
  const updateValues = setUpdateValues({
    raidEmbed: JSON.stringify(messageEmbedData),
    updatedAt: Date.now(),
    hasPendingUpdates: true,
    pendingUpdates: JSON.stringify([
      ...JSON.parse(raidRecord?.pendingUpdates || "[]"),
      messageEmbedData,
    ]),
  });

  const updatedRaid = await documentClient
    .update({
      TableName: raidsTable.name.get(),
      Key: {
        raidId,
        createdAt: raidRecord.createdAt,
      },
      ReturnValues: "UPDATED_NEW",
      UpdateExpression: updateValues.updateExpression,
      ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
      ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
    })
    .promise();
  // const raidEditResponse = (await rest.patch(
  //   (Routes as any).channelMessage(raidChannelId, raidMessageId),
  //   {
  //     body: {
  //       embeds: [{ ...currentEmbed, fields: updatedFieldsList }],
  //     },
  //   }
  // )) as RESTPostAPIChannelMessageResult;

  logger.log("info", "removed user", {
    raidId,
    userId,
    data,
    findRaidMessage,
    updatedRaid,
    messageEmbedData,
    updateValues,
  });
  const pendingUpdatesCount = JSON.parse(raidRecord?.pendingUpdates || '[]').length
  const reasonText = reason
    ? `since they ${reason}`
    : `for no specified reason`;
  return {
    body: {
      content: `<@${
        interactionConfig.member?.user?.id
      }> removed user <@${userId}> from Raid(${raidId}) ${reasonText}
      *Total pending updates: ${
        (pendingUpdatesCount || 0) + 1
      }*\n > Press \`Confirmed\` on the embeded raid to commit updates`,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};
