import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import { raidConfigs } from "../../../../embeds/templates/neverwinter/config";
import { IfactoryInitializations } from "../../typeDefinitions/event";
import { membersTable } from "../../../../../pulumi/persistantStore/tables/members";
import { setUpdateValues } from "../../../../store/utils";
import {
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import {
  createFieldValue,
  userState,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
} from "../../utils/helper/raid";
import { createEmbedArtifactSortContent } from "../../utils/helper/artifactsSorter";
export const raidArtifactSelectId = "select_Artifact";
export const raidArtifactSelect = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    documentClient,
    interactionConfig: { application_id, token, guild_id, member, message },
  } = factoryInits;
  const currentFields = message.embeds[0].fields || [];
  const selectedArtifactsList = data.values;
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
      userExists = false,
      userRecord = undefined,
      userStatus = undefined,
      sectionName = undefined,
      userIndex = 0,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, member.user.id);
  const existingUserClassType = userRecord?.name as string;
  if (!userExists) {
    return {
      body: {
        content: createRaidContent(message.content, {
          userActionText: `Warning - <@${member.user.id}> has to select a class before selecting an artifact !`,
        }),
      },
    };
  }
  const userStatusParse = userStatus?.replace(/[\[\]]+/gi, "");
  const creatableField: EmbedField = {
    name: existingUserClassType,
    value: createFieldValue({
      memberId: member.user.id,
      userStatus: userStatusParse as userState,
      artifactsList: selectedArtifactsList,
    }),
    inline: true,
  };
  const {updatedFieldsList, updatedSections} = determineActions(seperatedSections, {
    memberId: member.user.id,
    requestedUserSection: sectionName as Category,
    userField: creatableField,
    factoryInits,
    defaultSeperation: sectionSeperation,
  });
  const updateValues = setUpdateValues({
    artifactsList: selectedArtifactsList,
    serverId: guild_id,
    updatedAt: Date.now(),
  });
  try {
    await documentClient
      .update({
        TableName: membersTable.name.get(),
        Key: {
          discordMemberId: member.user.id,
          className: existingUserClassType,
        },
        ReturnValues: "UPDATED_NEW",
        UpdateExpression: updateValues.updateExpression,
        ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
        ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
      })
      .promise();
  } catch (error) {
    logger.log(
      "error",
      (error as any).message || "error occured updating record",
      error
    );
  }
  logger.log("info", "values to update", {
    userExists,
    userRecord,
    guild_id,
    selectedArtifactsList,
    creatableField,
    updateValues,
    updatedFieldsList,
  });
  return {
    body: {
      embeds: [{ ...message.embeds[0], fields: updatedFieldsList }],
      content: createRaidContent(message.content, {
        userActionText: `<@${member.user.id}> updated ${selectedArtifactsList.length} artifacts`,
        userArtifacts: createEmbedArtifactSortContent(updatedSections)
      }),
    },
  };
};
