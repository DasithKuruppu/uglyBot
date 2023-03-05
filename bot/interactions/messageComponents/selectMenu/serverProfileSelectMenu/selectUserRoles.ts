import {
  APIChatInputApplicationCommandInteractionData,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
  APIApplicationCommandInteractionDataSubcommandOption,
  RESTGetAPIGuildResult,
  APIMessageSelectMenuInteractionData,
  RESTGetAPIChannelMessageResult,
  RESTGetAPIGuildRolesResult,
} from "discord.js";
import { IfactoryInitializations } from "../../../typeDefinitions/event";
import { Logger } from "winston";
import {
  getTimeZones,
  serverProfileBuilder,
} from "../../../../embeds/templates/serverProfile/getServerProfile";
import {
  getServerProfile,
  updateServerProfile,
} from "../../utils/storeOps/serverProfile";
export const serverProfileRoles = "select_serverroles";
export const serverProfileRoleSelect = async (
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
  const userName = embed.author?.name;
  const [requestedText, profileText, ofText, userDiscordId] = content
    .trim()
    .split(" ");
  const selectedRoles = data?.values;
  const serverInfo = (await rest.get(
    (Routes as any).guild(guild_id)
  )) as RESTGetAPIGuildResult;
  const serverName = serverInfo.name;
  const ownerId = serverInfo.owner_id;
  if (member?.user?.id !== serverInfo.owner_id) {
    return {
      body: {
        embeds: message.embeds,
        component: message.components,
        content: `Requested server profile of ${serverName}`,
        allowed_mentions: {
          parse: [],
        },
      },
    };
  }
  const updatedServerProfile = await updateServerProfile(
    {
      discordServerId: serverInfo.id,
      updates: {
        serverName,
        serverOwnerId: ownerId,
        updatedAt: new Date().getTime().toString(),
        serverRoles: selectedRoles,
      },
    },
    { documentClient }
  );
  logger.log("info", { updateServerProfile });
  const serverProfile = await getServerProfile(
    { discordServerId: guild_id },
    { documentClient }
  );
  const timeZone = getTimeZones().find(({ value }) => {
    return value === serverProfile?.timezoneOffset;
  });
  const guildRoles = (await rest.get(
    (Routes as any).guildRoles(guild_id)
  )) as RESTGetAPIGuildRolesResult;
  const buildData = serverProfileBuilder({
    userId: member.user.id,
    timeZone: timeZone?.label,
    userName,
    ownerId,
    serverRoles: serverProfile?.serverRoles || [],
    serverName,
    guildRoles,
    thumbnailUrl: `https://cdn.discordapp.com/${guild_id}/icons/guild_id/guild_icon.png?size=512`,
    activityList: [],
  });

  return {
    body: {
      ...buildData,
      content: `Requested server profile of ${serverName}`,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};
