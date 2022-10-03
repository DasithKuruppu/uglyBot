import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import { IfactoryInitializations } from "../../typeDefinitions/event";

import {
  Category,
  determineActions,
  fivePersonSeperation,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
  tenPersonSeperation,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import { convertToDiscordDate } from "../../utils/date/dateToDiscordTimeStamp";
import {
  createFieldValue,
  defaultJoinStatus,
  userState,
} from "../../utils/helper/embedFieldAttribute";
import { createRaidContent } from "../../utils/helper/raid";
import { isFivePersonDungeon } from "../../utils/helper/userActions";
export const raidClassSelectId = "select_Class";
export const defaultArtifactState = ``;

export const raidClassSelect = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    interactionConfig: { application_id, token, member, message },
  } = factoryInits;
  const currentFields = message.embeds[0].fields || [];
  const requestedClass = data.values[0];
  const currentClassInfo = new Map(
    NeverwinterClassesMap as [[string, { type: Category; emoji: string }]]
  ).get(requestedClass);
  const fivePerson = isFivePersonDungeon(message.embeds[0]?.title);
  const sectionSeperation = fivePerson ? fivePersonSeperation : tenPersonSeperation;
  const seperatedSections = getEmbedFieldsSeperatedSections(currentFields, sectionSeperation);
  const [
    {
      userArtifacts = "",
      userExists = false,
      userStatus = defaultJoinStatus,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, member.user.id);
  const userArtifactsParse = userExists
    ? userArtifacts.replace(/[\{\}]+/gi, "").split(",")
    : undefined;
  const userStatusParse = userStatus?.replace(/[\[\]]+/gi, "");
  const creatableField: EmbedField = {
    name: requestedClass,
    value: createFieldValue({
      memberId: member.user.id,
      userStatus: userStatusParse as userState,
      artifactsList: userArtifactsParse,
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

  const updatedFieldsList = determineActions(seperatedSections, {
    memberId: member.user.id,
    requestedUserSection: currentClassInfo?.type || Category.WAITLIST,
    userField: creatableField,
    factoryInits,
    defaultSeperation: sectionSeperation
  });

  logger.log("info", "updated fields list", {
    updatedFieldsList,
  });
  return {
    body: {
      embeds: [{ ...message.embeds[0], fields: updatedFieldsList }],
      content: createRaidContent(message.content, {
        userActionText: `<@${member.user.id}> joined raid as ${requestedClass} `,
      }),
    },
  };
};
