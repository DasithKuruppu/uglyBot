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
  EmbedField,
} from "discord.js";
import { Logger } from "winston";
import { raidsTable } from "../../../../pulumi/persistantStore/tables/raids";
import { defaultClassName, getOptionsList } from "../../../embeds/templates/neverwinter/classesList";
import { raidConfigs } from "../../../embeds/templates/neverwinter/config";
import { availableSlotValue } from "../../../embeds/templates/neverwinter/raid";
import { setUpdateValues } from "../../../store/utils";
import {
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../messageComponents/utils/categorizeEmbedFields/categorizeEmbedFields";
import { extractShortArtifactNames, isEmoji } from "../../messageComponents/utils/helper/artifactsRenderer";
import { defaultJoinStatus } from "../../messageComponents/utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
  getRaidTime,
} from "../../messageComponents/utils/helper/raid";
import { getLastUsersClass, getRaid } from "../../messageComponents/utils/storeOps/fetchData";
import { ACTIVITY_STATUS, updateActions } from "../../messageComponents/utils/storeOps/memberActions";
import { IfactoryInitializations } from "../../typeDefinitions/event";

export const removeRaidUserCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const { rest, logger, documentClient, interactionConfig } = factoryInits;
  const { guild_id, channel_id, member } = interactionConfig;
  const [{ type, options, name }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const [{ type: subCommandType, options: subCommandOptions = [] }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const userId = subCommandOptions.find(({ name }) => name === "user")?.value;
  const raidId = subCommandOptions.find(({ name }) => name === "raid_id")
    ?.value as string;
  const reason = subCommandOptions.find(({ name }) => name === "reason")?.value;
  const creatorId = interactionConfig.member?.user?.id;
  const defaultClass = getOptionsList().find(
    ({ value }) => value === defaultClassName
  );
  const [persistedClassInfo, raidRecord] = await Promise.all([
    getLastUsersClass(member, {
      documentClient,
    }),
    getRaid({ raidId }, { documentClient }),
  ]);
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
  const pendingUpdateData = raidRecord.hasPendingUpdates ? JSON.parse(raidRecord?.pendingUpdates || "[]") : [];
  const [previousPendingUpdate] = pendingUpdateData.slice(-1);
  const [currentEmbed] = raidRecord?.hasPendingUpdates
    ? previousPendingUpdate?.embeds
    : embeds;
  logger.log("info", "raid message data", { currentEmbed, raidRecord });
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
      optionalClasses = [],
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
  const userArtifactsParse = userExists
    ? userArtifacts.replace(/[\{\}]+/gi, "").split(/[,|\s]+/)
    : undefined;
  const [firstArtifact = "unknown"] = userArtifactsParse || [];
  const isEmojiText = isEmoji(firstArtifact);
  const emojiProcessedArtifactlist = isEmojiText
    ? extractShortArtifactNames(userArtifactsParse)
    : userArtifactsParse;
  const artifactsList = userArtifactsParse
  ? emojiProcessedArtifactlist
  : persistedClassInfo?.artifactsList;
const primaryClassName =
  (userRecord as EmbedField)?.name ||
  persistedClassInfo?.className ||
  (defaultClass?.value as string);
const optionalClassesNames = userExists
  ? optionalClasses
  : persistedClassInfo?.optionalClasses;
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

  const pendingUpdate= [
    ...pendingUpdateData,
    messageEmbedData,
  ];
  const updateValues = setUpdateValues({
    raidEmbed: JSON.stringify(messageEmbedData),
    updatedAt: Date.now(),
    hasPendingUpdates: true,
    pendingUpdates: JSON.stringify(pendingUpdate)
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
  const pendingUpdatesCount = pendingUpdateData.length;
  const reasonText = reason
    ? `since they ${reason}`
    : `for no specified reason`;
  const status = ACTIVITY_STATUS.REMOVED;
  const createdAt = new Date().getTime();
  await updateActions(
        {
          discordMemberId: userId as string,
          compositeRaidStatusDate: `${createdAt}#${raidId}#${status}`,
          updates: {
            raidId,
            status,
            raidTitle: raidRecord?.title,
            raidType:raidRecord?.type,
            raidTime: getRaidTime(raidRecord?.eventDiscordDateTime),
            currentSection: sectionName,
            requestedSectionName: sectionName,
            artifactsList,
            token: factoryInits?.interactionConfig?.token,
            primaryClassName,
            optionalClassesNames: optionalClassesNames || [],
            serverId: guild_id,
            channelId: channel_id,
            createdAt,
            metaData: {
              removedReason: reasonText,
              removedBy: interactionConfig.member?.user?.id,
            },
            embed: JSON.stringify(messageEmbedData.embeds[0]),
            hasPendingUpdates: true,
            pendingUpdate: JSON.stringify(pendingUpdate),
          },
        },
        { documentClient }
  );
    
  
  return {
    body: {
      content: `<@${
        interactionConfig.member?.user?.id
      }> removed user <@${userId}> from Raid(${raidId}) ${reasonText}
      *Total pending updates: ${
        (pendingUpdatesCount || 0) + 1
      }*\n > *IMPORTANT* Press \`Join\` on the relavent raid to confirm updates`,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};
