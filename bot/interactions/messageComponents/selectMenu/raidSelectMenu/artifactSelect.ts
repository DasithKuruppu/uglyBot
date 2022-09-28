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
import { convertToDiscordDate } from "../../utils/date/dateToDiscordTimeStamp";
import {
  createFieldValue,
  userState,
} from "../../utils/helper/embedFieldAttribute";
export const raidArtifactSelectId = "select_Artifact";
export const raidArtifactSelect = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    interactionConfig: { application_id, token, member, message },
  } = factoryInits;
  const currentFields = message.embeds[0].fields || [];
  const selectedArtifactsList = data.values;

  const seperatedSections = getEmbedFieldsSeperatedSections(currentFields);
  const [{ userExists, userRecord, userStatus, sectionName, userIndex }] =
    getExistingMemberRecordDetails(seperatedSections, member.user.id);
  const existingUserName = userRecord?.name as string;
  if (!userExists) {
    return {
      body: {
        content: `Last activity(${convertToDiscordDate("now", {
          relative: true,
        })}) : \n Warning - <@${
          member.user.id
        }> has to select a class before selecting an artifact !`,
      },
    };
  }
  const userStatusParse = userStatus?.replace(/[\[\]]+/gi, "");
  const creatableField: EmbedField = {
    name: existingUserName,
    value: createFieldValue({
      memberId: member.user.id,
      userStatus: userStatusParse as userState,
      artifactsList: selectedArtifactsList,
    }),
    inline: true,
  };
  const updatedFieldsList = determineActions(seperatedSections, {
    memberId: member.user.id,
    requestedUserSection: sectionName as Category,
    userField: creatableField,
    factoryInits,
  });
  logger.log("info", "values to update", {
    userExists,
    userRecord,
    selectedArtifactsList,
    creatableField,
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
  return {
    body: {
      content: `Last activity(${convertToDiscordDate("now", {
        relative: true,
      })}) : \n <@${member.user.id}> updated ${
        selectedArtifactsList.length
      } artifacts`,
    },
  };
};
