import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import {
  defaultClassName,
  getOptionsList,
  NeverwinterClassesMap,
} from "../../../../embeds/templates/neverwinter/classesList";
import { raidConfigs } from "../../../../embeds/templates/neverwinter/config";
import { membersTable } from "../../../../../pulumi/persistantStore/tables/members";
import { IfactoryInitializations } from "../../../typeDefinitions/event";

import {
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import {
  createFieldName,
  createFieldValue,
  defaultJoinStatus,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
  getRaidTime,
  getRaidTitle,
} from "../../utils/helper/raid";
import { createEmbedArtifactSortContent } from "../../utils/helper/artifactsSorter";
import {
  extractShortArtifactNames,
  isEmoji,
} from "../../utils/helper/artifactsRenderer";
import {
  ACTIVITY_STATUS,
  updateActions,
} from "../../utils/storeOps/memberActions";
import {
  getLastUsersClass,
  getUserByClass,
} from "../../utils/storeOps/fetchData";
import { userStatusCodes } from "../../utils/storeOps/userStatus";

export const raidClassSelectId = "select_Class";
export const defaultArtifactState = ``;

export const raidClassSelect = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    documentClient,
    interactionConfig: {
      application_id,
      token,
      channel_id,
      guild_id,
      member,
      message,
    },
  } = factoryInits;
  const { raidTitle, raidType } = getRaidTitle(message.embeds[0]?.title);
  const currentFields = message.embeds[0].fields || [];
  const [requestedClass, ...optionalRequestedClasses] = data.values;
  const messageContent = message?.content;
  const messageEmbed = message.embeds[0];
  const [unprocessedRaidId, unprocessedRaidTime] =
    messageEmbed.description?.split("\n") as string[];
  const raidId = unprocessedRaidId.replace("🆔 ", "");
  const raidTime = getRaidTime(unprocessedRaidTime.replace("⏱️ ", ""));
  const currentClassInfo = new Map(
    NeverwinterClassesMap as [[string, { type: Category; label: string }]]
  ).get(requestedClass);

  const { templateId } = determineRaidTemplateType({
    embedFields: currentFields || [],
  });
  const sectionSeperation = raidConfigs[templateId];
  const seperatedSections = getEmbedFieldsSeperatedSections(
    currentFields,
    sectionSeperation
  );
  const [persistedClassInfo /*, persistedRaidInfo*/] = await Promise.all([
    getUserByClass(member, requestedClass, {
      documentClient,
    }),
    // getRaid({ raidId }, { documentClient }),
  ]);
  const defaultSelectedClassType =
    (currentClassInfo?.type as Category) || Category.WAITLIST;
  const [
    {
      userArtifacts = "",
      userExists = false,
      userStatus = defaultJoinStatus,
      userRecord = {},
      optionalClasses = [],
      sectionName = defaultSelectedClassType,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, member.user.id);
  const userArtifactsParse = userExists
    ? userArtifacts.replace(/[\{\}]+/gi, "").split(/[,|\s]+/)
    : undefined;
  const [firstArtifact = "unknown"] = userArtifactsParse || [];
  const isEmojiText = isEmoji(firstArtifact);
  const emojiProcessedArtifactlist = isEmojiText
    ? extractShortArtifactNames(userArtifactsParse)
    : userArtifactsParse;

  logger.log("info", "persisted Item", {
    persistedClassInfo,
    userStatus,
    defaultJoinStatus,
    userArtifactsParse,
    emojiProcessedArtifactlist,
  });
  const artifactsList =
    persistedClassInfo?.artifactsList || emojiProcessedArtifactlist || [];
  const primaryClassName = requestedClass;
  const optionalClassesNames = optionalRequestedClasses || [];
  const mountList = persistedClassInfo?.mountsList || [];
  const creatableField: EmbedField = {
    name: createFieldName(
      {
        fieldName: requestedClass,
        optionalClasses: optionalClassesNames,
      },
      { classNamesList: getOptionsList() }
    ),
    value: createFieldValue({
      memberId: member.user.id,
      userStatus: persistedClassInfo?.userStatus || userStatusCodes.RANK_I,
      artifactsList,
      mountList
    }),
    inline: true,
  };

  logger.log("info", "values to update", {
    requestedClass,
    creatableField,
    userArtifacts,
    seperatedSections,
    sectionRequested: currentClassInfo?.type,
  });

  const { updatedFieldsList, updatedSections } = determineActions(
    seperatedSections,
    {
      memberId: member.user.id,
      requestedUserSection: currentClassInfo?.type || Category.WAITLIST,
      userField: creatableField,
      factoryInits,
      defaultSeperation: sectionSeperation,
    }
  );
  const status = ACTIVITY_STATUS.JOINED_CLASS_SELECT;
  const createdAt = new Date().getTime();
  const updatedActionsRecord = await updateActions(
    {
      discordMemberId: member?.user?.id,
      compositeRaidStatusDate: `${createdAt}#${raidId}#${status}`,
      updates: {
        raidId,
        status,
        raidTitle,
        raidType,
        raidTime,
        currentSection: sectionName,
        requestedSectionName: defaultSelectedClassType,
        artifactsList,
        token,
        primaryClassName,
        optionalClassesNames: optionalClassesNames || [],
        serverId: guild_id,
        channelId: channel_id,
        createdAt,
        embed: JSON.stringify([
          {
            ...message.embeds[0],
            description: messageEmbed.description,
            fields: updatedFieldsList,
          },
        ]),
        hasPendingUpdates: false,
        pendingUpdate: [],
      },
    },
    { documentClient }
  );
  logger.log("info", "updated fields list", {
    updatedFieldsList,
  });
  return {
    body: {
      embeds: [{ ...message.embeds[0], fields: updatedFieldsList }],
      content: createRaidContent(message.content, {
        userActionText: `<@${member.user.id}> joined raid as ${requestedClass}.`,
        userArtifacts: createEmbedArtifactSortContent(
          updatedSections,
          raidTitle
        ),
      }),
    },
  };
};
