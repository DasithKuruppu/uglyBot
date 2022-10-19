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
} from "discord.js";
import { Logger } from "winston";

interface factoryInitializations {
  logger: Logger;
  rest: REST;
  interactionConfig: {
    guild_id: string;
    channel_id: string;
    application_id: string;
    token: string;
    member: APIInteractionGuildMember;
  };
}

export const inviteLinkCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: factoryInitializations
) => {
  const { rest, logger, interactionConfig } = factoryInits;
  const { guild_id, channel_id } = interactionConfig;
  const [{ type, options, name }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const numberOfPeople = 10;
  const expiresAt = dayjs(Date.now()).add(1,"hour").unix();
  const createdInvite = (await rest.post((Routes as any).channelInvites(channel_id), {
    body: {
      max_age: 3600, // max one hour,
      max_uses: numberOfPeople,
      unique: true
    } as RESTPostAPIChannelInviteJSONBody,
  })) as RESTPostAPIChannelInviteResult;
  logger.log("info", "invite created", { data, createdInvite });
  return {
    body: {
      content: createdInvite?.code ? `Created an invite link - https://discord.gg/${createdInvite?.code} \n
      Max uses - ${numberOfPeople} / Expires <t:${expiresAt}:R>`: `Unable to create an invite link, please try again`,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};
