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
} from "../../utils/storeOps/userStatus";
import { updateMemberDetails } from "../../utils/storeOps/members";
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
  getTimeZones,
  profileBuilder,
  UserStatusValues,
} from "../../../../embeds/templates/neverwinter/profile";
import {
  ACTIVITY_STATUS,
  getMemberActions,
} from "../../utils/storeOps/memberActions";
import { displayArtifactAsEmoji } from "../../utils/helper/artifactsRenderer";
import { fieldSorter } from "../../utils/helper/artifactsSorter";
import { getUserProfile, updateUserProfile } from "../../utils/storeOps/userProfile";
import { getUserAvailability } from "../../utils/storeOps/userAvailability";
import { normalizeTime } from "../../utils/date/dateToDiscordTimeStamp";
export const profileTimezoneSelectId = "select_profile_timezone";

export const profileTimeZoneSelect = async (
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
  const [selectedTimeZone] = data.values;
  const statusUpvotes = await listUserStatusChanges(userId, {
    documentClient,
  });

  const memberActivity = await getMemberActions(
    { user: { id: userId } } as APIInteractionGuildMember,
    {
      documentClient,
    }
  );

  const isUserAllowed = userId === member.user.id;
  console.log({isUserAllowed});
  isUserAllowed &&
    (await updateUserProfile(
      {
        discordMemberId: userId,
        updates: {
          userName: member?.user?.username,
          updatedAt: new Date().toISOString(),
          timezoneOffset: selectedTimeZone,
        },
      },
      { documentClient }
    ));
  const lastUserClassActivity = await getLastUsersClass(
    { user: { id: userId } } as APIInteractionGuildMember,
    {
      documentClient,
    }
  );
  console.log({lastUserClassActivity});
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

  const { className, optionalClasses, updatedAt, artifactsList, mountsList } =
    lastUserClassActivity;
  const defaultClassesSelected = createFieldName(
    { fieldName: className, optionalClasses: optionalClasses },
    { classNamesList: classOptionsList }
  );
  const artifactsEmoji = displayArtifactAsEmoji(artifactsList).join("|");
  const firstRankStatusCode =
    firstRank?.userStatusCode || userStatusCodes.RANK_I;

    const [userProfile, userAvailability] = await Promise.all([
      getUserProfile({ discordMemberId: userId }, { documentClient }),
      getUserAvailability(userId, { documentClient }),
    ]);
    
  const processedUserAvailability = userAvailability.map(
    ({ availableDayUTC, availableStartTimeUTC, availableDuration }) => {
      
      const normalizedDate = normalizeTime(
        `${availableDayUTC} ${availableStartTimeUTC}`,
        { offSet: "GMT+0:00" }
      );
      const epochTime = Math.floor(normalizedDate.getTime() / 1000);
      return {
        startTime: epochTime,
        endTime: epochTime +  epochTime + (Number(availableDuration) * 60 * 60),
      }
    }
  );
    const timeZone = getTimeZones().find(({value})=>{
      return value === userProfile?.timezoneOffset;
    });
    console.log({timeZone});
  const buildData = profileBuilder({
    userId,
    timeZone,
    availabilityList: processedUserAvailability,
    prefferedRaids: userProfile?.prefferedTrials || [],
    preferredRunTypes: userProfile?.preferredRunTypes || [],
    userName: processedProfileUserName,
    activityList: processedMemberActivity,
    trialsParticipatedOn: [],
    userStatus: statusSymbols[firstRankStatusCode],
    rankList: rankList.map(
      ({ userStatusCode, upvotesCount, userStatusText }) => {
        return `> ${statusSymbols[userStatusCode]} - ${upvotesCount} votes`;
      }
    ),
    mountsList: mountsList,
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
