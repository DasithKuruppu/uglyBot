import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import { IfactoryInitializations } from "../../typeDefinitions/event";
import {
  availableSlotValue,
  Category,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import { convertToDiscordDate } from "../../utils/date/dateToDiscordTimeStamp";
import {
  createFieldValue,
  userState,
  defaultJoinStatus,
} from "../../utils/helper/embedFieldAttribute";

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
  const seperatedSections = getEmbedFieldsSeperatedSections(currentFields);
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
        content: `Last activity(${convertToDiscordDate("now", {
          relative: true,
        })}): \n <@${member.user.id}> opted to not join raid`,
      },
    };
  }

  const responseResult = await rest.patch(
    (Routes as any).channelMessage(message.channel_id, message.id),
    {
      body: {
        embeds: [
          {
            ...message.embeds[0],
            fields: currentFields.map((field) => {
              if ((userRecord as EmbedField).value === field.value) {
                return {
                  ...field,
                  name: sectionName,
                  value: availableSlotValue,
                };
              }
              return field;
            }),
          },
        ],
      },
    }
  );
  logger.log("info", "successfully withdrawn user", { responseResult });
  return {
    body: {
      flags: 64,
      content: `Last activity(${convertToDiscordDate("now", {
        relative: true,
      })}) : \n <@${member.user.id}> withdrew from raid`,
    },
  };
};
