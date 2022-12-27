import {
  APIInteractionGuildMember,
  APIMessageSelectMenuInteractionData,
} from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import { IfactoryInitializations } from "../../../typeDefinitions/event";
import {
  listUserStatusChanges,
  updateuserStatus,
  userStatusCodes,
} from "../../../../interactions/messageComponents/utils/storeOps/userStatus";
import { updateMemberStatus } from "../../../../interactions/messageComponents/utils/storeOps/members";
import {
  createFieldName,
  createFieldValue,
  defaultJoinStatus,
  statusSymbols,
} from "../../utils/helper/embedFieldAttribute";

import {
  defaultClassName,
  getOptionsList,
  NeverwinterClassesMap,
} from "../../../../embeds/templates/neverwinter/classesList";
import { getLastUsersClass } from "../../utils/storeOps/fetchData";
import {
  profileBuilder,
  UserStatusValues,
} from "../../../../embeds/templates/neverwinter/profile";
import {
  ACTIVITY_STATUS,
  getMemberActions,
} from "../../utils/storeOps/memberActions";
import { displayArtifactAsEmoji } from "../../utils/helper/artifactsRenderer";
import { fieldSorter } from "../../utils/helper/artifactsSorter";
export const profileStatusVoteId = "select_profile_status";

export const profileStatusVote = async (
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
      channel_id,
      guild_id,
      member,
      message,
    },
  } = factoryInits;
  const embed = message?.embeds[0];
  const content = message?.content;
  const [firstPart, UnprocessedprofileUserName] = embed.title?.split("-") || [];
  const processedProfileUserName = UnprocessedprofileUserName.trim();
  const [requestedText, profileText, ofText, userDiscordId] = content
    .trim()
    .split(" ");
  const userId = userDiscordId.substring(2, userDiscordId.length - 1);
  const [selectedStatusValue] = data.values;
  const mappedStatusCodes = {
    [UserStatusValues.RANKI]: userStatusCodes.RANK_I,
    [UserStatusValues.RANKII]: userStatusCodes.RANK_II,
    [UserStatusValues.RANKIII]: userStatusCodes.RANK_III,
    [UserStatusValues.RANKIV]: userStatusCodes.RANK_IV,
    [UserStatusValues.RANKV]: userStatusCodes.RANK_V,
  };
  const selectedStatusCode = mappedStatusCodes[selectedStatusValue];
  const updatedUserStatus = await updateuserStatus(
    {
      discordMemberId: userId,
      updates: {
        interactingDiscordMemberId: member.user.id,
        statusCode: selectedStatusCode,
        voted: true,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        statusName: selectedStatusValue,
      },
    },
    { documentClient: documentClient }
  );
  const statusUpvotes = await listUserStatusChanges(userId, {
    documentClient,
  });

  logger.log("info", {selectedStatusCode, statusUpvotes, updatedUserStatus});
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

  const memberActivity = await getMemberActions(
    { user: { id: userId } } as APIInteractionGuildMember,
    {
      documentClient,
    }
  );
  const lastUserClassActivity = await getLastUsersClass(
    { user: { id: userId } } as APIInteractionGuildMember,
    {
      documentClient,
    }
  );
  logger.log("info", { rankList, firstRank, memberActivity, lastUserClassActivity });
  const updatedMember = await updateMemberStatus(
    userId,
    { userStatus: firstRank?.userStatusCode },
    { documentClient }
  );
  logger.log("info", {
    updatedMember,
    statusUpvotes,
    updatedUserStatus,
    userId,
    content,
    member,
    selectedStatusCode,
    selectedStatusValue,
  });

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


  const { className, optionalClasses, updatedAt, artifactsList } =
    lastUserClassActivity;
  const defaultClassesSelected = createFieldName(
    { fieldName: className, optionalClasses: optionalClasses },
    { classNamesList: classOptionsList }
  );
  const artifactsEmoji = displayArtifactAsEmoji(artifactsList).join("|");
  const firstRankStatusCode = firstRank?.userStatusCode || userStatusCodes.RANK_I;
  const buildData = profileBuilder({
    userId,
    userName: processedProfileUserName,
    activityList: processedMemberActivity,
    trialsParticipatedOn: [],
    userStatus: statusSymbols[firstRankStatusCode],
    rankList: rankList.map(
      ({ userStatusCode, upvotesCount, userStatusText }) => {
        return `> ${statusSymbols[userStatusCode]} - ${upvotesCount} votes`;
      }
    ),
    classesPlayed: [
      `Class (Main and Optional): ${defaultClassesSelected} \n\u200b\n Artifacts: ${artifactsEmoji}`,
    ],
  });

  return {
    body: {
      ...buildData,
    },
  };
};
