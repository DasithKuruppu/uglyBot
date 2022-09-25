import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import { IfactoryInitializations } from "../../typeDefinitions/event";

import {
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import {
  createFieldValue,
  defaultJoinStatus,
  userState,
} from "../../utils/helper/embedFieldAttribute";
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
  const seperatedSections = getEmbedFieldsSeperatedSections(currentFields);
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
  });

  logger.log("info", "updated fields list", {
    updatedFieldsList,
  });
  const responseResult = await rest.patch(
    (Routes as any).channelMessage(message.channel_id, message.id),
    {
      body: {
        embeds: [{ ...message.embeds[0], fields: updatedFieldsList }],
      },
    }
  );
  logger.log("info", "successfully added user to raid", { responseResult });
  return {
    body: {
      flags: 1 << 6,
      content: `successfully joined raid as ${requestedClass}`,
    },
  };
};
