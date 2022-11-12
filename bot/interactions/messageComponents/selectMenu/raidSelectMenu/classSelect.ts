import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import {
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
  userState,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
} from "../../utils/helper/raid";
import { isFivePersonDungeon } from "../../utils/helper/userActions";
import { createEmbedArtifactSortContent } from "../../utils/helper/artifactsSorter";
import {
  extractShortArtifactNames,
  isEmoji,
} from "../../utils/helper/artifactsRenderer";

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
    interactionConfig: { application_id, token, guild_id, member, message },
  } = factoryInits;
  const [raidTitle] = (message.embeds[0]?.title || "").split("-");
  const currentFields = message.embeds[0].fields || [];
  const [requestedClass, ...optionalRequestedClasses] = data.values;
  const currentClassInfo = new Map(
    NeverwinterClassesMap as [[string, { type: Category; emoji: string }]]
  ).get(requestedClass);
  const { templateId } = determineRaidTemplateType({
    embedFields: currentFields || [],
  });
  const sectionSeperation = raidConfigs[templateId];
  const seperatedSections = getEmbedFieldsSeperatedSections(
    currentFields,
    sectionSeperation
  );
  const [
    {
      userArtifacts = "",
      userExists = false,
      userStatus = defaultJoinStatus,
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
  const userStatusParse = userStatus?.replace(/[\[\]]+/gi, "");
  const { Item = {} } = await documentClient
    .get({
      TableName: membersTable.name.get(),
      Key: {
        discordMemberId: member.user.id,
        className: requestedClass,
      },
    })
    .promise();
  logger.log("info", "persisted Item", {
    Item,
    userArtifactsParse,
    emojiProcessedArtifactlist,
  });
  const creatableField: EmbedField = {
    name: createFieldName(
      {
        fieldName: requestedClass,
        optionalClasses: optionalRequestedClasses
      },
      { classNamesList: getOptionsList() }
    ),
    value: createFieldValue({
      memberId: member.user.id,
      userStatus: userStatusParse as userState,
      artifactsList: Item?.artifactsList || emojiProcessedArtifactlist,
    }),
    inline: true,
  };

  logger.log("info", "values to update", {
    requestedClass,
    Item,
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

  logger.log("info", "updated fields list", {
    updatedFieldsList,
  });
  return {
    body: {
      embeds: [{ ...message.embeds[0], fields: updatedFieldsList }],
      content: createRaidContent(message.content, {
        userActionText: `<@${member.user.id}> joined raid as ${requestedClass} `,
        userArtifacts: createEmbedArtifactSortContent(
          updatedSections,
          raidTitle
        ),
      }),
    },
  };
};
