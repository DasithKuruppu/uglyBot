import {
  APIChatInputApplicationCommandInteractionData,
  REST,
  Routes,
  APIInteractionGuildMember,
} from "discord.js";
import ShortUniqueId from 'short-unique-id';
import { Logger } from "winston";
import { raidBuilder } from "../../../embeds/templates/neverwinter/raid";
import { getOptionsList } from "../../../embeds/templates/neverwinter/classesList";
import { convertToDiscordDate } from "../../messageComponents/utils/date/dateToDiscordTimeStamp";
import { raidsTable } from "../../../../pulumi/persistantStore/tables/raids";
import {
  createRaidNameChoicesList,
  trialNamesList,
} from "../../../registerCommands/commands";
import { isFivePersonDungeon } from "../../messageComponents/utils/helper/userActions";
import { setUpdateValues } from "../../../store/utils";
interface factoryInitializations {
  logger: Logger;
  rest: REST;
  documentClient: any,
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
  const classOptionsList = getOptionsList();
  const createOptions = data?.options?.[0] as any;
  const raidOptions = createOptions?.options || [];
  const title =
    raidOptions.find(({ name }) => name === "name")?.value || "Untitled";
  const type = raidOptions.find(({ name }) => name === "type")?.value || "";
  const description =
    raidOptions.find(({ name }) => name === "description")?.value || "";
  const dateTime = raidOptions.find(({ name }) => name === "date")?.value || "";
  const partyComposition =
    raidOptions.find(({ name }) => name === "party")?.value || "Standard";

  const nameToCoverUrl = {
    [trialNamesList.TOMM]:
      "https://pwimages-a.akamaihd.net/arc/8d/5d/8d5d88772e1edccad4f98cb882677a5e1564178653.jpg",
    [trialNamesList.ZCM]:
      "https://static.wikia.nocookie.net/dungeonsdragons/images/4/43/Zariel.jpg/revision/latest?cb=20200408175529",
    [trialNamesList.COKM]:
      "https://cdn.player.one/sites/player.one/files/styles/full_large/public/2022/01/12/neverwinter-update.jpg",
    [trialNamesList.TM]:
      "https://db4sgowjqfwig.cloudfront.net/campaigns/68638/assets/330407/Tiamat_Mobile.jpg?1400812964",
    [trialNamesList.TOSM]:
      "https://static.wikia.nocookie.net/forgottenrealms/images/f/fd/Spider_Temple_Concept.png/revision/latest/scale-to-width-down/350?cb=20210725190230",
  };

  const isFivePerson = isFivePersonDungeon(title);
  const requestedDate = convertToDiscordDate(dateTime);
  const requestedRelativeDate = convertToDiscordDate(dateTime,{relative:true})
  logger.log("info", "create attributes", {isFivePerson, requestedDate, dateTime});
  const partyOptionsToMap = {
    Standard: { DPS: 6, HEALS: 2, TANKS: 2, WAITLIST: 3 },
    Solo_tank: { DPS: 7, HEALS: 2, TANKS: 1, WAITLIST: 3 },
    Solo_heal: { DPS: 7, HEALS: 1, TANKS: 2, WAITLIST: 3 },
    Solo_tank_heal: { DPS: 8, HEALS: 1, TANKS: 1, WAITLIST: 3 },
  };
  const uniqueRaidId = new ShortUniqueId({ length: 10 })();
  const raidEmbed = raidBuilder({
    title,
    description,
    raidId: uniqueRaidId,
    eventDateTime: requestedDate,
    relativeEventDateTime: requestedRelativeDate,
    coverImageUrl: nameToCoverUrl[title],
    type: type || "Farm Run",
    author:
      (interactionConfig.member as any)?.nick ||
      interactionConfig.member.user.username,
    classOptionsList: classOptionsList,
    template: partyOptionsToMap[partyComposition],
    ...(isFivePerson && {
      template: { DPS: 3, HEALS: 1, TANKS: 1, WAITLIST: 3 },
    }),
  });
  const updateValues = setUpdateValues({
    title,
    creatorId: interactionConfig.member?.user?.id,
    autorName:(interactionConfig.member as any)?.nick ||
    interactionConfig.member?.user?.username,
    eventDiscordDateTime: requestedDate,
    isFivePerson,
    description,
    template:JSON.stringify(partyOptionsToMap[partyComposition] || {}),
    coverImageUrl: nameToCoverUrl[title],
    type,
    raidEmbed: JSON.stringify(raidEmbed),
    serverId: interactionConfig?.guild_id,
    updatedAt: Date.now(),
  });
  logger.log("info", "creating raid", {
    updateValues,
    raidId: uniqueRaidId,
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
  });
  return {
    body: {
      content: `Event/Raid will start on ${requestedDate}`,
      ...raidEmbed,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};

//https://discordjs.guide/popular-topics/embeds.html#resending-a-received-embed
