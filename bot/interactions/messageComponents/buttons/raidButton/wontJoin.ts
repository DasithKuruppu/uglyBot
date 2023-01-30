import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { IfactoryInitializations } from "../../../typeDefinitions/event";
import {
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import {
  defaultJoinStatus,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
  getRaidTime,
  getRaidTitle,
} from "../../utils/helper/raid";
import { raidConfigs } from "../../../../embeds/templates/neverwinter/config";
import { createEmbedArtifactSortContent } from "../../utils/helper/artifactsSorter";
import { availableSlotValue } from "../../../../embeds/templates/neverwinter/raid";
import {
  ACTIVITY_STATUS,
  updateActions,
} from "../../utils/storeOps/memberActions";
import {
  extractShortArtifactNames,
  isEmoji,
} from "../../utils/helper/artifactsRenderer";
import { EmbedField } from "discord.js";

export const wontJoinButtonInteract = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    documentClient,
    interactionConfig: {
      application_id,
      token,
      guild_id,
      channel_id,
      member,
      message,
    },
  } = factoryInits;
  const currentFields = message.embeds[0].fields || [];
  const messageEmbed = message.embeds[0];
  const [unprocessedRaidId, unprocessedRaidTime] = messageEmbed.description?.split("\n") as string[];
  const raidId = unprocessedRaidId.replace("🆔 ", "");
  const raidTime = getRaidTime(unprocessedRaidTime.replace("⏱️ ", ""));
  const { raidTitle, raidType } = getRaidTitle(message.embeds[0]?.title);
  const { templateId } = determineRaidTemplateType({
    embedFields: currentFields || [],
  });
  logger.log("info", "current fields", { currentFields });
  const sectionSeperation = raidConfigs[templateId];
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
      optionalClasses = [],
      userRecord = {},
      sectionName = Category.WAITLIST,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, member.user.id);
  const userArtifactsParse = userExists
    ? userArtifacts.replace(/[\{\}]+/gi, "").split(/[,|\s]+/)
    : undefined;

  const [firstArtifact = "unknown"] = userArtifactsParse || [];
  const isEmojiText = isEmoji(firstArtifact);
  const emojiProcessedArtifactlist = isEmojiText
    ? extractShortArtifactNames(userArtifactsParse)
    : userArtifactsParse;
  const artifactsList = emojiProcessedArtifactlist;
  const primaryClassName = (userRecord as EmbedField)?.name;
  if (!userExists) {
    return {
      body: {
        content: createRaidContent(message.content, {
          userActionText: ` <@${member.user.id}> rage quit the raid !`,
        }),
      },
    };
  }
  const { updatedFieldsList, updatedSections } = determineActions(
    seperatedSections,
    {
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
    }
  );
  const status = ACTIVITY_STATUS.RAGE_QUIT;
  const createdAt = new Date().getTime();
  const updatedActions = await updateActions(
    {
      discordMemberId: member?.user?.id,
      compositeRaidStatusDate: `${createdAt}#${raidId}#${status}`,
      updates: {
        raidId,
        status,
        raidTitle,
        raidType,
        raidTime,
        currentSection: sectionName,
        requestedSectionName: sectionName,
        artifactsList,
        primaryClassName,
        optionalClassesNames: optionalClasses,
        serverId: guild_id,
        channelId: channel_id,
        token,
        createdAt,
        embed: JSON.stringify([
          {
            ...message.embeds[0],
            description: messageEmbed.description,
            fields: updatedFieldsList,
          },
        ]),
        hasPendingUpdates: false,
        pendingUpdate: [],
      },
    },
    { documentClient }
  );
  return {
    body: {
      content: createRaidContent(message.content, {
        userActionText: `<@${member.user.id}> rage quit the raid!`,
        userArtifacts: createEmbedArtifactSortContent(
          updatedSections,
          raidTitle
        ),
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
