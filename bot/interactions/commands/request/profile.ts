import {
  APIChatInputApplicationCommandInteractionData,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
  APIApplicationCommandInteractionDataSubcommandOption,
} from "discord.js";

import { Logger } from "winston";
import {
  getNewClassOptionsList,
  getOptionsList,
} from "../../../embeds/templates/neverwinter/classesList";
import { profileBuilder, UserStatusValues } from "../../../embeds/templates/neverwinter/profile";
import { convertToDiscordDate } from "../../messageComponents/utils/date/dateToDiscordTimeStamp";
import { displayArtifactAsEmoji } from "../../messageComponents/utils/helper/artifactsRenderer";
import { fieldSorter } from "../../messageComponents/utils/helper/artifactsSorter";
import {
  createFieldName,
  defaultJoinStatus,
  statusSymbols,
} from "../../messageComponents/utils/helper/embedFieldAttribute";
import { getLastUsersClass } from "../../messageComponents/utils/storeOps/fetchData";
import {
  ACTIVITY_STATUS,
  getMemberActions,
} from "../../messageComponents/utils/storeOps/memberActions";
import { listUserStatusChanges, userStatusCodes } from "../../messageComponents/utils/storeOps/userStatus";
import { IfactoryInitializations } from "../../typeDefinitions/event";

export const profileCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const { rest, logger, interactionConfig, documentClient } = factoryInits;
  const [{ type: subCommandType, options: subCommandOptions = [] }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const userId =
    (subCommandOptions.find(({ name }) => name === "user")?.value as string) ||
    (interactionConfig?.member.user.id as string);
  const resolvedMembers = data.resolved?.users || {};
  const member = resolvedMembers?.[userId]
    ? { user: resolvedMembers?.[userId] }
    : interactionConfig?.member;
  const userName = member?.user.username;

  const memberActivity = await getMemberActions(
    member as APIInteractionGuildMember,
    {
      documentClient,
    }
  );
  const classOptionsList = getOptionsList();
  const processedMemberActivity = memberActivity.map(
    ({
      metaData,
      createdAt,
      status,
      raidId,
      raidTitle,
      raidType,
      requestedSectionName,
      primaryClassName,
      optionalClassesNames,
    }) => {
      const classesEmojis = createFieldName(
        { fieldName: primaryClassName, optionalClasses: optionalClassesNames },
        { classNamesList: classOptionsList }
      );
      const activityTime = Math.round(Number(createdAt) / 1000);
      const timestamp = `<t:${activityTime}:R>`;
      const activityText = {
        [ACTIVITY_STATUS.REMOVED]: `> ${timestamp}: <@${metaData?.removedBy}> (Admin) removed your ${classesEmojis} from ${raidTitle}[${raidType}] (Raid ID:${raidId}) ${metaData?.removedReason}`,
      };
      const customMessage = activityText[status];
      const defaultMessage = `> ${timestamp}: ${status} ${raidTitle}[${raidType}] (Raid ID: **${raidId}**) with ${classesEmojis}`;
      return customMessage ? customMessage : defaultMessage;
    }
  );

  const lastUserClassActivity = await getLastUsersClass(
    member as APIInteractionGuildMember,
    {
      documentClient,
    }
  );
  if(!lastUserClassActivity){
    return {
      body: {
        content: `Requested profile of <@${userId}> \n > No data records was found for this user`,
        allowed_mentions: {
          parse: [],
        },
      },
    };
  }
  const { className, optionalClasses, updatedAt, artifactsList } =
    lastUserClassActivity;
  const defaultClassesSelected = createFieldName(
    { fieldName: className, optionalClasses: optionalClasses },
    { classNamesList: classOptionsList }
  );
  const artifactsEmoji = displayArtifactAsEmoji(artifactsList).join("|");
  const statusUpvotes = await listUserStatusChanges(userId, {
    documentClient,
  });


  const RankIList = statusUpvotes.filter(
    ({ statusCode }) => statusCode === userStatusCodes.RANK_I
  );
  const RankIIList = statusUpvotes.filter(
    ({ statusCode }) => statusCode === userStatusCodes.RANK_II
  );
  const RankIIIList = statusUpvotes.filter(
    ({ statusCode }) => statusCode === userStatusCodes.RANK_III
  );
  const RankIVList = statusUpvotes.filter(
    ({ statusCode }) => statusCode === userStatusCodes.RANK_IV
  );
  const RankVList = statusUpvotes.filter(
    ({ statusCode }) => statusCode === userStatusCodes.RANK_V
  );

  const rankList = [
    {
      userStatusCode: userStatusCodes.RANK_I,
      upvotesCount: RankIList.length,
      userStatusText: UserStatusValues.RANKI,
    },
    {
      userStatusCode: userStatusCodes.RANK_II,
      upvotesCount: RankIIList.length,
      userStatusText: UserStatusValues.RANKII,
    },
    {
      userStatusCode: userStatusCodes.RANK_III,
      upvotesCount: RankIIIList.length,
      userStatusText: UserStatusValues.RANKIII,
    },
    {
      userStatusCode: userStatusCodes.RANK_IV,
      upvotesCount: RankIVList.length,
      userStatusText: UserStatusValues.RANKIV,
    },
    {
      userStatusCode: userStatusCodes.RANK_V,
      upvotesCount: RankVList.length,
      userStatusText: UserStatusValues.RANKV,
    },
  ]
    .filter(({ upvotesCount = 0 }) => upvotesCount > 0)
    .sort(fieldSorter(["-upvotesCount"]));

  const [firstRank] = rankList;

  const firstRankStatusCode = firstRank?.userStatusCode || userStatusCodes.RANK_I;
  const buildData = profileBuilder({
    userId,
    userName,
    activityList: processedMemberActivity,
    rankList: rankList.map(
      ({ userStatusCode, upvotesCount, userStatusText }) => {
        return `> ${statusSymbols[userStatusCode]} - ${upvotesCount} votes`;
      }
    ),
    userStatus: statusSymbols[firstRankStatusCode],
    trialsParticipatedOn: [],
    classesPlayed: [`Class (Main and Optional): ${defaultClassesSelected} \n\u200b\n Artifacts: ${artifactsEmoji}`],
  });

  return {
    body: {
      ...buildData,
      content: `Requested profile of <@${userId}>`,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};
