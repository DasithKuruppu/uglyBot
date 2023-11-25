import {
  APIChatInputApplicationCommandInteractionData,
  REST,
  Routes,
  APIInteractionGuildMember,
  RESTPostAPIChannelMessageResult,
} from "discord.js";
import ShortUniqueId from "short-unique-id";
import { Logger } from "winston";
import { raidBuilder } from "../../../embeds/templates/neverwinter/raid";
import {
  getNewClassOptionsList,
  getOptionsList,
} from "../../../embeds/templates/neverwinter/classesList";
import {
  convertToDiscordDate,
  normalizeTime,
} from "../../messageComponents/utils/date/dateToDiscordTimeStamp";
import { raidsTable } from "../../../../pulumi/persistantStore/tables/raids";
import {
  createRaidNameChoicesList,
  previousTrialNamesList,
  trialNamesList,
} from "../../../registerCommands/commands";
import { isFivePersonDungeon } from "../../messageComponents/utils/helper/userActions";
import { setUpdateValues } from "../../../store/utils";
import { getServerProfile } from "../../messageComponents/utils/storeOps/serverProfile";
interface factoryInitializations {
  logger: Logger;
  rest: REST;
  documentClient: any;
  interactionConfig: {
    application_id: string;
    token: string;
    guild_id: string;
    member: APIInteractionGuildMember;
    channel_id: string;
  };
}

export const createRaidCommand = async (
  data: APIChatInputApplicationCommandInteractionData & { guild_id: string },
  factoryInits: factoryInitializations
) => {
  const { rest, logger, documentClient, interactionConfig } = factoryInits;
  logger.log("info", "recieved create/raid interaction", {
    data,
    interactionConfig,
  });
  const classOptionsList = getNewClassOptionsList();
  const createOptions = data?.options?.[0] as any;
  const raidOptions = createOptions?.options || [];
  const title =
    raidOptions.find(({ name }) => name === "name")?.value || "Untitled";
  const type = raidOptions.find(({ name }) => name === "type")?.value || "Farm";
  const description =
    raidOptions.find(({ name }) => name === "description")?.value || "";
  const dateTime = raidOptions.find(({ name }) => name === "date")?.value || "";
  const partyComposition =
    raidOptions.find(({ name }) => name === "party")?.value || "Standard";
  const requirementsValue =
    raidOptions.find(({ name }) => name === "requirements")?.value || "None";
  const commencedVoiceChatChannel = raidOptions.find(
    ({ name }) => name === "voice"
  )?.value;
  const nameToCoverUrl = {
    [trialNamesList.Battle_of_the_Moon_Dancer_M]: "https://cdn.discordapp.com/attachments/1109471948645355551/1165189390541267004/img-bHaY5o4EGHZ2RTjchbwubo0q.png",
    [trialNamesList.DWP]: "https://cdn.discordapp.com/attachments/1109471948645355551/1124953782036480080/Deamonwebpits.png",
    [previousTrialNamesList.DWP]: "https://cdn.discordapp.com/attachments/1109471948645355551/1124953782036480080/Deamonwebpits.png",
    [trialNamesList.DWP_Advanced]: "https://cdn.discordapp.com/attachments/1109471948645355551/1124953782036480080/Deamonwebpits.png",
    [trialNamesList.Dragon_hunts]: 'https://cdn.discordapp.com/attachments/1109471948645355551/1139797154395857016/img-EBHqbvnop8Ez0USCmOEEOPQ9.png',
    [trialNamesList.TOMM]:
      "https://pwimages-a.akamaihd.net/arc/8d/5d/8d5d88772e1edccad4f98cb882677a5e1564178653.jpg",
    [trialNamesList.GAZEMNIDS_RELIQUARY_M]:
      "https://i.ibb.co/qsVXXJJ/img-atd-Npq30-Pp-Rdfo-Vw-MN6yzl-RR.png",
    [trialNamesList.ZCM]:
      "https://static.wikia.nocookie.net/dungeonsdragons/images/4/43/Zariel.jpg/revision/latest?cb=20200408175529",
    [trialNamesList.COKM]:
      "https://cdn.discordapp.com/attachments/1109471948645355551/1162820681512255538/img-k2MxbbU3vQfOslKohhOTwfWs.png",
    [trialNamesList.TM]:
      "https://db4sgowjqfwig.cloudfront.net/campaigns/68638/assets/330407/Tiamat_Mobile.jpg?1400812964",
    [trialNamesList.VOS]:
      "https://pwimages-a.akamaihd.net/arc/14/57/1457e07177cd42d03f8ef695335a88441613762258.jpg",
    [trialNamesList.TOSM]:
      "https://static.wikia.nocookie.net/forgottenrealms/images/f/fd/Spider_Temple_Concept.png/revision/latest/scale-to-width-down/350?cb=20210725190230",
    [trialNamesList.REAPERS_CHALLENGE]:
      "https://mmorpg.gg/wp-content/uploads/2020/02/Neverwinter-Infernal-Descent-screenshot-3.jpg",
  };
  const defaultCoverImage =
    "https://mmorpg.gg/wp-content/uploads/2020/02/Neverwinter-Infernal-Descent-screenshot-3.jpg";
  const processedCommenceChannel = commencedVoiceChatChannel
    ? `<#${commencedVoiceChatChannel}>`
    : `Not specified`;
  const serverProfile = await getServerProfile(
    { discordServerId: interactionConfig.guild_id },
    { documentClient }
  );
  const processedTime = normalizeTime(dateTime, {
    offSet: serverProfile?.timezoneOffset,
  });
  const isFivePerson = isFivePersonDungeon(title);
  const requestedDate = convertToDiscordDate(processedTime);
  const requestedRelativeDate = convertToDiscordDate(processedTime, {
    relative: true,
  });
  const requirements: string[] = requirementsValue.split(",");
  logger.log("info", "create attributes", {
    requestedDate,
    processedTime,
    serverProfile,
    dateTime,
  });
  const partyOptionsToMap = {
    Standard: { DPS: 6, HEALS: 2, TANKS: 2, WAITLIST: 6 },
    Solo_tank: { DPS: 7, HEALS: 2, TANKS: 1, WAITLIST: 6 },
    Solo_heal: { DPS: 7, HEALS: 1, TANKS: 2, WAITLIST: 6 },
    Solo_tank_heal: { DPS: 8, HEALS: 1, TANKS: 1, WAITLIST: 6 },
    Three_heal: { DPS: 5, HEALS: 3, TANKS: 2, WAITLIST: 6 },
    Three_heal_one_tank: { DPS: 6, HEALS: 3, TANKS: 1, WAITLIST: 6 },
  };
  const uniqueRaidId = new ShortUniqueId({ length: 10 })();
  const raidEmbed = raidBuilder({
    title,
    description,
    requirements,
    commencedVoiceChatChannel: processedCommenceChannel,
    raidId: uniqueRaidId,
    eventDateTime: requestedDate,
    relativeEventDateTime: requestedRelativeDate,
    coverImageUrl: nameToCoverUrl[title] || defaultCoverImage,
    type: type || "Farm",
    author:
      (interactionConfig.member as any)?.nick ||
      interactionConfig.member.user.username,
    classOptionsList: classOptionsList,
    template: partyOptionsToMap[partyComposition],
    ...(isFivePerson && {
      template: { DPS: 3, HEALS: 1, TANKS: 1, WAITLIST: 3 },
    }),
  });

  logger.log("info", "creating raid", {
    raidId: uniqueRaidId,
    raidEmbed,
  });
  const raidCreateResponse = (await rest.patch(
    (Routes as any).webhookMessage(
      interactionConfig.application_id,
      interactionConfig.token
    ),
    {
      body: {
        content: `Event/Raid will start on ${requestedDate}`,
        ...raidEmbed,
        allowed_mentions: {
          parse: [],
        },
      },
    }
  )) as RESTPostAPIChannelMessageResult;
  const updateValues = setUpdateValues({
    title,
    creatorId: interactionConfig.member?.user?.id,
    autorName:
      (interactionConfig.member as any)?.nick ||
      interactionConfig.member?.user?.username,
    eventDiscordDateTime: requestedDate,
    isFivePerson,
    description,
    template: JSON.stringify(partyOptionsToMap[partyComposition] || {}),
    coverImageUrl: nameToCoverUrl[title] || defaultCoverImage,
    type,
    raidEmbed: JSON.stringify(raidEmbed),
    serverId: interactionConfig?.guild_id,
    messageId: raidCreateResponse?.id,
    channelId: raidCreateResponse?.channel_id,
    updatedAt: Date.now(),
  });
  const createdRaid = await documentClient
    .update({
      TableName: raidsTable.name.get(),
      Key: {
        raidId: uniqueRaidId,
        createdAt: Date.now(),
      },
      ReturnValues: "UPDATED_NEW",
      UpdateExpression: updateValues.updateExpression,
      ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
      ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
    })
    .promise();

  logger.log("info", "created raid", {
    createdRaid,
    updateValues,
    raidCreateResponse,
  });
  return false;
};

//https://discordjs.guide/popular-topics/embeds.html#resending-a-received-embed
