import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import { raidConfigs } from "../../../../embeds/templates/neverwinter/config";
import { IfactoryInitializations } from "../../../typeDefinitions/event";
import { membersTable } from "../../../../../pulumi/persistantStore/tables/members";
import { setUpdateValues } from "../../../../store/utils";
import {
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import {
  createFieldName,
  createFieldValue,
  userState,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
  getRaidTitle,
} from "../../utils/helper/raid";
import { createEmbedArtifactSortContent } from "../../utils/helper/artifactsSorter";
import {
  defaultClassName,
  getOptionsList,
  NeverwinterClassesMap,
} from "../../../../embeds/templates/neverwinter/classesList";
import { getLastUsersClass } from "../../utils/storeOps/fetchData";
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
  const raidTitle = getRaidTitle(message.embeds[0]?.title);
  const selectedArtifactsList = data.values;
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
  const PersistedClassInfo = await getLastUsersClass(member, { documentClient });
  const defaultClassType =
    (new Map(NeverwinterClassesMap).get(PersistedClassInfo?.className || defaultClass?.value)
      ?.type as Category) || Category.WAITLIST;
  const [
    {
      userExists = false,
      userRecord = undefined,
      userStatus = undefined,
      sectionName = defaultClassType,
      optionalClasses=[],
      userIndex = 0,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, member.user.id);
  const existingUserClassType = userRecord?.name as string;
  const userStatusParse = userStatus?.replace(/[\[\]]+/gi, "");
  const creatableField: EmbedField = {
    name: createFieldName(
      {
        fieldName:
          (userRecord as EmbedField)?.name ||
          PersistedClassInfo?.className ||
          (defaultClass?.value as string),
          optionalClasses
      },
      { classNamesList: getOptionsList() }
    ),
    value: createFieldValue({
      memberId: member.user.id,
      userStatus: userStatusParse as userState,
      artifactsList: selectedArtifactsList,
    }),
    inline: true,
  };
  const { updatedFieldsList, updatedSections } = determineActions(
    seperatedSections,
    {
      memberId: member.user.id,
      requestedUserSection: sectionName as Category,
      userField: creatableField,
      factoryInits,
      defaultSeperation: sectionSeperation,
    }
  );
  const updateValues = setUpdateValues({
    artifactsList: selectedArtifactsList,
    serverId: guild_id,
    updatedAt: Date.now(),
    optionalClasses,
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
        userArtifacts: createEmbedArtifactSortContent(updatedSections,raidTitle),
      }),
    },
  };
};
