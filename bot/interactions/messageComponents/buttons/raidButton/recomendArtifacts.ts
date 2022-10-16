import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes, BitField } from "discord.js";
import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import {
  fivePersonSeperation,
  raidConfigs,
  tenPersonSeperation,
} from "../../../../embeds/templates/neverwinter/config";
import { IfactoryInitializations } from "../../typeDefinitions/event";
import {
  Category,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import { artifactsSort } from "../../utils/helper/artifactsSorter";
import {
  defaultJoinStatus,
  extractFieldValueAttributes,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
} from "../../utils/helper/raid";

export const defaultArtifactState = ``;

export const recomendArtifactsButtonInteract = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    interactionConfig: { application_id, token, member, message },
  } = factoryInits;
  const currentFields = message.embeds[0].fields || [];
  const { templateId } = determineRaidTemplateType({
    embedFields: currentFields || [],
  });
  const sectionSeperation = raidConfigs[templateId];
  const seperatedSections = getEmbedFieldsSeperatedSections(
    currentFields,
    sectionSeperation
  );
  const classNamesMap = new Map(NeverwinterClassesMap);

  logger.log("info", "recomend artifacts button", { seperatedSections });
  const [
    {
      userArtifacts = "",
      userExists = false,
      userStatus = defaultJoinStatus,
      userRecord = {},
      sectionName = Category.WAITLIST,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, member.user.id);

  const artifactDetails = [
    ...seperatedSections[Category.DPS],
    ...seperatedSections[Category.TANK],
    ...seperatedSections[Category.HEALER],
  ];
  const artifactMemberlist = artifactDetails.filter(({name,value})=>{
    return value !== 'available';
  }).map(({ name, value }) => {
    const { memberId, userStatus, artifactsList } = extractFieldValueAttributes(
      { fieldValueText: value }
    );

    return {
      name: memberId,
      category: classNamesMap.get(name)?.type || Category.DPS,
      artifacts: artifactsList,
    };
  });
  const sortedArtifacts = artifactsSort(artifactMemberlist);
  logger.log("info", "artifacts sorted", {
    sortedArtifacts,
    artifactDetails,
    artifactMemberlist,
  });
  const assignedArtifacts = sortedArtifacts
    .filter(({ artifactName, user }) => user)
    .map(({ artifactName, user }) => `<@${user}> => ${artifactName}`)
    .join("\n");
  const unassignedArtifacts = sortedArtifacts
    .filter(({ artifactName, user }) => !user)
    .map(({ artifactName, user }) => artifactName)
    .join(",");
  return {
    body: {
      content: createRaidContent(message.content, {
        userArtifacts: `\n𒆜𒆜Assigned/Recommended Artifacts List𒆜𒆜\n${assignedArtifacts}\n𒆜𒆜Excess/Unassigned Artifacts𒆜𒆜\n${unassignedArtifacts}`,
        userActionText: `<@${member.user.id}> requested to recomend artifacts.`,
      }),
    },
  };
};
