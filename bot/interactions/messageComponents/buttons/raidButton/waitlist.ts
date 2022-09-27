import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import { IfactoryInitializations } from "../../typeDefinitions/event";
import { Category, determineActions, getEmbedFieldsSeperatedSections, getExistingMemberRecordDetails } from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import { createFieldValue, userState, defaultJoinStatus} from "../../utils/helper/embedFieldAttribute";


export const waitlistButtonInteract = async (
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
  logger.log("info", "waitlist button", {seperatedSections})
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
          "Select a class / artifact before joining into wait list",
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
      userStatus: userState.TENTATIVE,
      artifactsList: userArtifactsParse,
    }),
    inline: true,
  };

  const updatedFieldsList = determineActions(seperatedSections, {
    memberId: member.user.id,
    requestedUserSection: Category.WAITLIST,
    userField: creatableField,
    factoryInits
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
  logger.log("info", "successfully updated user category", { responseResult });
  return {
    body: {
      flags: 64,
      content: `successfully moved to ${Category.WAITLIST}`,
    },
  };
};
