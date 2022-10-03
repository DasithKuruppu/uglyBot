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
  userState,
  defaultJoinStatus,
} from "../../utils/helper/embedFieldAttribute";
import { createRaidContent } from "../../utils/helper/raid";
import { isFivePersonDungeon } from "../../utils/helper/userActions";

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
  const fivePerson = isFivePersonDungeon(message.embeds[0]?.title);
  const sectionSeperation = fivePerson
    ? fivePersonSeperation
    : tenPersonSeperation;
  const seperatedSections = getEmbedFieldsSeperatedSections(
    currentFields,
    sectionSeperation
  );
  logger.log("info", "waitlist button", { seperatedSections });
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
          userActionText: `<@${member.user.id}> needs to select class/artifacts before joining wait list`,
        })
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
        userActionText: `<@${member.user.id}> joined wait list!`,
      }),
    },
  };
};
