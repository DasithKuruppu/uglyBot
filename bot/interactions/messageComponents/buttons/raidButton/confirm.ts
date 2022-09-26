import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import { IfactoryInitializations } from "../../typeDefinitions/event";
import { Category, determineActions, getEmbedFieldsSeperatedSections, getExistingMemberRecordDetails } from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import { createFieldValue, userState, defaultJoinStatus} from "../../utils/helper/embedFieldAttribute";

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
  const seperatedSections = getEmbedFieldsSeperatedSections(currentFields);
  logger.log("info", "confirm button", {seperatedSections})
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
        content:
          "Select a class / artifact before confirming",
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
  logger.log("info", "successfully updated user state", { responseResult });
  return {
    body: {
      flags: 64,
      content: `successfully updated state as ${userState.CONFIRMED}`,
    },
  };
};