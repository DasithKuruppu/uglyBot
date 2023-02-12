import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { IfactoryInitializations } from "../../../typeDefinitions/event";
import {
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import { defaultJoinStatus } from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
  getRaidTime,
  getRaidTitle,
} from "../../utils/helper/raid";
import { raidSummaryBuilder } from "../../../../embeds/templates/raidSummary/raidSummary";
import { getAvailableUpcomingWeekRaids } from "../../../../interactions/utils/util";
export const refreshRaidSummary = async (
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
  const processedUpcomingRaids = await getAvailableUpcomingWeekRaids({
    serverId: guild_id,
    documentClient,
    rest,
    logger,
  });

  logger.log("info", "processed raids", { processedUpcomingRaids });

  const buildData = raidSummaryBuilder({
    userId: member.user.id,
    raidsList: processedUpcomingRaids,
  });

  return {
    body: {
      ...buildData,
      content: ``,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};
