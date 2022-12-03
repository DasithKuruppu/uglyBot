import dayjs from "dayjs-parser/dayjs";
import {
  APIChatInputApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataRoleOption,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
  RESTPostAPIChannelInviteJSONBody,
  RESTPostAPIChannelInviteResult,
  APIApplicationCommandInteractionDataSubcommandOption,
  RESTGetAPIChannelMessageResult,
  RESTPostAPIChannelMessageResult,
} from "discord.js";
import { Logger } from "winston";
import { raidsTable } from "../../../../pulumi/persistantStore/tables/raids";
import { raidConfigs } from "../../../embeds/templates/neverwinter/config";
import {
  availableSlotValue,
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../messageComponents/utils/categorizeEmbedFields/categorizeEmbedFields";
import { defaultJoinStatus } from "../../messageComponents/utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
} from "../../messageComponents/utils/helper/raid";
import { getRaid } from "../../messageComponents/utils/storeOps/fetchData";
import { IfactoryInitializations } from "../../typeDefinitions/event";

export const removeRaidUserCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const { rest, logger, documentClient, interactionConfig } = factoryInits;
  const { guild_id, channel_id } = interactionConfig;
  const [{ type, options, name }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const [{ type: subCommandType, options: subCommandOptions = [] }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const userId = subCommandOptions.find(({ name }) => name === "user")?.value;
  const raidId = subCommandOptions.find(
    ({ name }) => name === "raid_id"
  )?.value;
  const reason = subCommandOptions.find(({ name }) => name === "reason")?.value;
  const creatorId = interactionConfig.member?.user?.id;
  const raidRecord = await getRaid({ raidId, creatorId }, { documentClient });

  const raidChannelId = raidRecord?.channelId;
  const raidMessageId = raidRecord?.messageId;
  if (!raidChannelId || !raidMessageId) {
    return {
      body: {
        content: `No record for this raid exists or you are not the creator of this raid. 
        Unable to remove user <@${userId}>`,
        allowed_mentions: {
          parse: [],
        },
      },
    };
  }
  const findRaidMessage = (raidRecord &&
    (await rest.get(
      (Routes as any).channelMessage(raidChannelId, raidMessageId)
    ))) as RESTGetAPIChannelMessageResult;
  if (!findRaidMessage) {
    return {
      body: {
        content: `Could not find the raid message accociated with this raid Id. 
          Unable to remove user <@${userId}>`,
        allowed_mentions: {
          parse: [],
        },
      },
    };
  }
  const { content, embeds } = findRaidMessage;
  const [currentEmbed] = embeds;
  const { templateId } = determineRaidTemplateType({
    embedFields: currentEmbed?.fields || [],
  });
  const sectionSeperation = raidConfigs[templateId];
  const seperatedSections = getEmbedFieldsSeperatedSections(
    currentEmbed.fields || [],
    sectionSeperation
  );
  logger.log("info", "remove raid user", { findRaidMessage, raidRecord });
  const [
    {
      userArtifacts = "",
      userExists = false,
      userStatus = defaultJoinStatus,
      userRecord = {},
      sectionName = Category.WAITLIST,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, userId as string);
  if (!userExists) {
    return {
      body: {
        content: `Could not find this user <@${userId}> on the embed`,
        allowed_mentions: {
          parse: [],
        },
      },
    };
  }

  const { updatedFieldsList, updatedSections } = determineActions(
    seperatedSections,
    {
      memberId: userId as string,
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

  const raidEditResponse = (await rest.patch(
    (Routes as any).channelMessage(raidChannelId, raidMessageId),
    {
      body: {
        embeds: [{ ...currentEmbed, fields: updatedFieldsList }],
      },
    }
  )) as RESTPostAPIChannelMessageResult;

  logger.log("info", "removed user", {
    raidId,
    userId,
    data,
    findRaidMessage,
    raidEditResponse,
  });
  const reasonText = reason ? `since he/she ${reason}` : `for no specified reason`;
  return {
    body: {
      content: `<@${
        interactionConfig.member?.user?.id
      }> removed user <@${userId}> ${reasonText}
      *Please do note that there is a known limitation/bug on discord API which will cause the emojis to not show up once a user is removed.
      You could however do any interaction(like press confirm) on the embed after removing a user to make it show the emojis again*`,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};
