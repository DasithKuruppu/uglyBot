import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes, BitField } from "discord.js";
import {
  ClassNames,
  defaultClassName,
  getOptionsList,
  NeverwinterClassesMap,
} from "../../../../embeds/templates/neverwinter/classesList";
import {
  fivePersonSeperation,
  raidConfigs,
  tenPersonSeperation,
} from "../../../../embeds/templates/neverwinter/config";
import { IfactoryInitializations } from "../../../typeDefinitions/event";
import {
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import {
  extractShortArtifactNames,
  isEmoji,
} from "../../utils/helper/artifactsRenderer";
import {
  createFieldValue,
  defaultJoinStatus,
  createFieldName,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
  getRaidTime,
  getRaidTitle,
} from "../../utils/helper/raid";
import {
  createEmbedArtifactSortContent,
  fieldSorter,
} from "../../utils/helper/artifactsSorter";
import { getLastUsersClass, getRaid } from "../../utils/storeOps/fetchData";
import { updateRaid } from "../../utils/storeOps/updateData";
import {
  ACTIVITY_STATUS,
  updateActions,
} from "../../utils/storeOps/memberActions";
import { userStatusCodes } from "../../utils/storeOps/userStatus";
export const confirmButtonInteract = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    documentClient,
    interactionConfig: {
      application_id,
      guild_id,
      channel_id,
      token,
      member,
      message,
    },
  } = factoryInits;
  const messageContent = message?.content;
  const messageEmbed = message.embeds[0];

  const [unprocessedRaidId, unprocessedRaidTime] =
    messageEmbed.description?.split("\n") as string[];
  const raidId = unprocessedRaidId.replace("🆔 ", "");
  const raidTime = getRaidTime(unprocessedRaidTime.replace("⏱️ ", ""));
  const [persistedClassInfo, persistedRaidInfo] = await Promise.all([
    getLastUsersClass(member, {
      documentClient,
    }),
    getRaid({ raidId }, { documentClient }),
  ]);
  const hasPendingUpdates = !!persistedRaidInfo?.hasPendingUpdates;
  const [pendingUpdate] = JSON.parse(
    hasPendingUpdates ? persistedRaidInfo?.pendingUpdates : "[]"
  ).slice(-1);
  const processedEmbedFields = hasPendingUpdates
    ? pendingUpdate?.embeds?.[0]?.fields
    : messageEmbed.fields;
  const processedMessageContent =
    hasPendingUpdates && pendingUpdate.content
      ? pendingUpdate.content
      : messageContent;
  const processedEmbedDescription =
    hasPendingUpdates && pendingUpdate?.embeds?.[0]?.description
      ? pendingUpdate?.embeds?.[0]?.description
      : messageEmbed.description;
  const currentFields = processedEmbedFields;
  const { raidTitle, raidType } = getRaidTitle(messageEmbed?.title);

  logger.log("info", "Raid Info", { raidTime, raidType, raidTitle });
  const { templateId } = determineRaidTemplateType({
    embedFields: currentFields || [],
  });
  const sectionSeperation = raidConfigs[templateId];
  const seperatedSections = getEmbedFieldsSeperatedSections(
    currentFields,
    sectionSeperation
  );

  logger.log("info", "SeperationInfo", { sectionSeperation, seperatedSections});
  const defaultClass = getOptionsList().find(
    ({ value }) => value === defaultClassName
  );
  const classMap = new Map(NeverwinterClassesMap);

  const defaultSelectedClassType =
    (classMap.get(
      persistedClassInfo?.className || defaultClass?.value
    )?.type as Category) || Category.WAITLIST;
  logger.log("info", "confirm button", {
    seperatedSections,
    defaultClass,
    persistedRaidInfo,
    defaultSelectedClassType,
  });
  const [
    {
      userArtifacts = undefined,
      userExists = false,
      userStatus = defaultJoinStatus,
      userRecord = {},
      optionalClasses = [],
      sectionName = defaultSelectedClassType,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, member.user.id);
  const artifactsList = userArtifacts || persistedClassInfo?.artifactsList || [];
  const mountList = persistedClassInfo?.mountsList || [];
  const primaryClassName =
    (userRecord as EmbedField)?.name ||
    persistedClassInfo?.className ||
    (defaultClass?.value as string);
  const optionalClassesNames = userExists
    ? optionalClasses
    : persistedClassInfo?.optionalClasses;
  const creatableField: EmbedField = {
    name: createFieldName(
      {
        fieldName: primaryClassName,
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

  const { updatedFieldsList, updatedSections } = determineActions(
    seperatedSections,
    {
      memberId: member.user.id,
      requestedUserSection: classMap.get(primaryClassName)?.type as Category,
      userField: creatableField,
      factoryInits,
      defaultSeperation: sectionSeperation,
    }
  );

  const status = ACTIVITY_STATUS.JOINED;
  const createdAt = new Date().getTime();
  const actionsList = [
    updateActions(
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
          requestedSectionName: sectionName,
          artifactsList: artifactsList || [],
          mountsList: mountList,
          token,
          primaryClassName,
          optionalClassesNames: optionalClassesNames || [],
          serverId: guild_id,
          channelId: channel_id,
          createdAt,
          embed: JSON.stringify([
            {
              ...message.embeds[0],
              description: processedEmbedDescription,
              fields: updatedFieldsList,
            },
          ]),
          hasPendingUpdates,
          pendingUpdate: hasPendingUpdates
            ? persistedRaidInfo.pendingUpdates
            : [],
        },
      },
      { documentClient }
    ),
    ...(hasPendingUpdates
      ? [
          updateRaid(
            {
              raidId,
              createdAt: persistedRaidInfo.createdAt,
              updates: {
                pendingUpdates: [],
                hasPendingUpdates: false,
              },
            },
            { documentClient }
          ),
        ]
      : []),
  ];

  const [updatedActions, updatedRaid] = await Promise.all(actionsList);
  logger.log("info", "updated fields list", {
    updatedFieldsList,
    creatableField,
    updatedRaid,
  });
  return {
    body: {
      embeds: [
        {
          ...message.embeds[0],
          description: processedEmbedDescription,
          fields: updatedFieldsList,
        },
      ],
      content: createRaidContent(processedMessageContent, {
        userActionText: `<@${member.user.id}> joined the raid!`,
        userArtifacts: createEmbedArtifactSortContent(
          updatedSections,
          raidTitle
        ),
      }),
    },
  };
};
