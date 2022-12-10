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
  userState,
  defaultJoinStatus,
  createFieldName,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
  getRaidTitle,
} from "../../utils/helper/raid";
import { membersTable } from "../../../../../pulumi/persistantStore/tables/members";
import {
  createEmbedArtifactSortContent,
  fieldSorter,
} from "../../utils/helper/artifactsSorter";
import { getLastUsersClass, getRaid } from "../../utils/storeOps/fetchData";
import { updateRaid } from "../../utils/storeOps/updateData";
export const confirmButtonInteract = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    documentClient,
    interactionConfig: { application_id, token, member, message },
  } = factoryInits;
  const messageContent = message?.content;
  const messageEmbed = message.embeds[0];
  const [unprocessedRaidId] = messageEmbed.description?.split("\n") as string[];
  const raidId = unprocessedRaidId.replace("🆔 ", "");
  const [persistedClassInfo, persistedRaidInfo] = await Promise.all([
    getLastUsersClass(member, {
      documentClient,
    }),
    getRaid({ raidId }, { documentClient }),
  ]);
  const hasPendingUpdates = !!persistedRaidInfo?.hasPendingUpdates;
  const [pendingUpdate] = JSON.parse(
    persistedRaidInfo?.pendingUpdates || "[]"
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
  const raidTitle = getRaidTitle(messageEmbed?.title);

  const { templateId } = determineRaidTemplateType({
    embedFields: currentFields || [],
  });
  const sectionSeperation = raidConfigs[templateId];
  const seperatedSections = getEmbedFieldsSeperatedSections(
    currentFields,
    sectionSeperation
  );
  const defaultClass = getOptionsList().find(
    ({ value }) => value === defaultClassName
  );

  const defaultSelectedClassType =
    (new Map(NeverwinterClassesMap).get(
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

  const creatableField: EmbedField = {
    name: createFieldName(
      {
        fieldName:
          (userRecord as EmbedField)?.name ||
          persistedClassInfo?.className ||
          (defaultClass?.value as string),
        optionalClasses: userExists
          ? optionalClasses
          : persistedClassInfo?.optionalClasses,
      },
      { classNamesList: getOptionsList() }
    ),
    value: createFieldValue({
      memberId: member.user.id,
      userStatus: userState.CONFIRMED,
      artifactsList: userArtifactsParse
        ? emojiProcessedArtifactlist
        : persistedClassInfo?.artifactsList,
    }),
    inline: true,
  };

  const { updatedFieldsList, updatedSections } = determineActions(
    seperatedSections,
    {
      memberId: member.user.id,
      requestedUserSection: sectionName,
      userField: creatableField,
      factoryInits,
      defaultSeperation: sectionSeperation,
    }
  );
  const updatedRaid = hasPendingUpdates
    ? await updateRaid(
        {
          raidId,
          createdAt: persistedRaidInfo.createdAt,
          updates: {
            pendingUpdates: JSON.stringify([]),
            hasPendingUpdates: false,
          },
        },
        { documentClient }
      )
    : [];
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
        userActionText: `<@${member.user.id}> confirmed to join raid!`,
        userArtifacts: createEmbedArtifactSortContent(
          updatedSections,
          raidTitle
        ),
      }),
    },
  };
};
