import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import { IfactoryInitializations } from "../../typeDefinitions/event";
import {
  availableSlotValue,
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
  userState,
  defaultJoinStatus,
} from "../../utils/helper/embedFieldAttribute";
import { isFivePersonDungeon } from "../../utils/helper/userActions";
import { createRaidContent } from "../../utils/helper/raid";

export const wontJoinButtonInteract = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    interactionConfig: { application_id, token, member, message },
  } = factoryInits;
  const currentFields = message.embeds[0].fields || [];
  const fivePerson = isFivePersonDungeon(message.embeds[0]?.title);
  const sectionSeperation = fivePerson
    ? fivePersonSeperation
    : tenPersonSeperation;
  const seperatedSections = getEmbedFieldsSeperatedSections(
    currentFields,
    sectionSeperation
  );
  logger.log("info", "wont join button", { seperatedSections });
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
          userActionText: ` <@${member.user.id}> rage quit the raid !`,
        }),
      },
    };
  }
  const updatedFieldsList = determineActions(seperatedSections, {
    memberId: member.user.id,
    requestedUserSection: sectionName,
    userField: {
      inline: true,
      name: sectionName,
      value: availableSlotValue,
    },
    factoryInits,
    defaultSeperation: sectionSeperation,
    userRemove: true,
  });

  return {
    body: {
      content: createRaidContent(message.content, {
        userActionText: `<@${member.user.id}> rage quit the raid !`,
      }),
      embeds: [
        {
          ...message.embeds[0],
          fields: updatedFieldsList,
        },
      ],
    },
  };
};
