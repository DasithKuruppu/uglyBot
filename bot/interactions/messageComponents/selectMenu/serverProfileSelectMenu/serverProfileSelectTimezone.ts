import {
  APIChatInputApplicationCommandInteractionData,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
  APIApplicationCommandInteractionDataSubcommandOption,
  RESTGetAPIGuildResult,
  APIMessageSelectMenuInteractionData,
} from "discord.js";
import { IfactoryInitializations } from "../../../typeDefinitions/event";
import { Logger } from "winston";
import { getTimeZones, serverProfileBuilder } from "../../../../embeds/templates/serverProfile/getServerProfile";
import { updateServerProfile } from "../../utils/storeOps/serverProfile";
export const serverProfileTZSelect = "select_timezone";
export const timezoneSelect = async (
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
  const userId = "something";
  const [selectedTimezoneOffset] = data.values;
  const serverInfo = (await rest.get(
    (Routes as any).guild(guild_id)
  )) as RESTGetAPIGuildResult;
  const serverName = serverInfo.name;
  const ownerId = serverInfo.owner_id;
  const serverRoles = serverInfo.roles;
  if(member?.user?.id !== serverInfo.owner_id){
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
        timezoneOffset: selectedTimezoneOffset,
        serverOwnerId: ownerId,
        updatedAt: new Date().getTime().toString(),
      },
    },
    { documentClient }
  );
  logger.log("info", { updateServerProfile });
  const timeZone = getTimeZones().find(({value})=>{
    return value === selectedTimezoneOffset;
  });
  const buildData = serverProfileBuilder({
    userId: member.user.id,
    timeZone: timeZone?.label,
    userName,
    ownerId,
    serverRoles,
    serverName,
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
