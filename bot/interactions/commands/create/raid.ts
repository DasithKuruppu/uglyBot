import {
  APIChatInputApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataRoleOption,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
} from "discord.js";
import { Logger } from "winston";
import { raidBuilder } from "../../../embeds/templates/neverwinter/raid";
import { getOptionsList } from "../../../embeds/templates/neverwinter/classesList";
import { convertToDiscordDate } from "../../messageComponents/utils/date/dateToDiscordTimeStamp";
import {
  createRaidNameChoicesList,
  trialNamesList,
} from "../../../registerCommands/commands";
import { isFivePersonDungeon } from "../../messageComponents/utils/helper/userActions";
interface factoryInitializations {
  logger: Logger;
  rest: REST;
  interactionConfig: {
    application_id: string;
    token: string;
    member: APIInteractionGuildMember;
    channel_id: string;
  };
}

export const createRaidCommand = async (
  data: APIChatInputApplicationCommandInteractionData & { guild_id: string },
  factoryInits: factoryInitializations
) => {
  const { rest, logger, interactionConfig } = factoryInits;
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
  const raidEmbed = raidBuilder({
    title,
    description,
    coverImageUrl: nameToCoverUrl[title],
    type,
    author:
      (interactionConfig.member as any)?.nick ||
      interactionConfig.member.user.username,
    classOptionsList: classOptionsList,
    ...(isFivePerson && {
      template: { DPS: 3, HEALS: 1, TANKS: 1, WAITLIST: 3 },
    }),
  });

  const responseResult = await rest.post(
    (Routes as any).channelMessages(interactionConfig.channel_id),
    {
      body: {
        ...raidEmbed,
        allowed_mentions: {
          parse: [],
        },
      },
    }
  );
  logger.log("info", "created post with embed", responseResult);
  return {
    body: {
      content: `Event/Raid will start at ${requestedDate}`,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};

//https://discordjs.guide/popular-topics/embeds.html#resending-a-received-embed
