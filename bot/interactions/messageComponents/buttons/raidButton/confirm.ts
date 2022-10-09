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
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import {
  createFieldValue,
  userState,
  defaultJoinStatus,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
} from "../../utils/helper/raid";
import { isFivePersonDungeon } from "../../utils/helper/userActions";

export const confirmButtonId = "confirm_btn";
export const defaultArtifactState = ``;

export const confirmButtonInteract = async (
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
  logger.log("info", "confirm button", { seperatedSections });
  const [
    {
      userArtifacts = "",
      userExists = false,
      userStatus = defaultJoinStatus,
      userRecord = {},
      sectionName = Category.WAITLIST,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, member.user.id);
  if (!userExists) {
    return {
      body: {
        content: createRaidContent(message.content, {
          userActionText: `<@${member.user.id}> needs to select artifact or class before confirming!`,
        }),
      },
    };
  }
  const userArtifactsParse = userExists
    ? userArtifacts.replace(/[\{\}]+/gi, "").split(",")
    : undefined;
  const creatableField: EmbedField = {
    name: (userRecord as EmbedField)?.name,
    value: createFieldValue({
      memberId: member.user.id,
      userStatus: userState.CONFIRMED,
      artifactsList: userArtifactsParse,
    }),
    inline: true,
  };

  const updatedFieldsList = determineActions(seperatedSections, {
    memberId: member.user.id,
    requestedUserSection: sectionName || Category.WAITLIST,
    userField: creatableField,
    factoryInits,
    defaultSeperation: sectionSeperation,
  });

  logger.log("info", "updated fields list", {
    updatedFieldsList,
  });
  return {
    body: {
      embeds: [{ ...message.embeds[0], fields: updatedFieldsList }],
      content: createRaidContent(message.content, {
        userActionText: `<@${member.user.id}> confirmed to join raid!`,
      }),
    },
  };
};
