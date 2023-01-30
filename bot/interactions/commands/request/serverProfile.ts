import {
  APIChatInputApplicationCommandInteractionData,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
  APIApplicationCommandInteractionDataSubcommandOption,
  RESTGetAPIGuildResult,
} from "discord.js";

import { Logger } from "winston";
import { getTimeZones, serverProfileBuilder } from "../../../embeds/templates/serverProfile/getServerProfile";
import {
  ACTIVITY_STATUS,
  getMemberActions,
} from "../../messageComponents/utils/storeOps/memberActions";
import { getServerProfile } from "../../messageComponents/utils/storeOps/serverProfile";
import { IfactoryInitializations } from "../../typeDefinitions/event";

export const serverProfileCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const { rest, logger, interactionConfig, documentClient } = factoryInits;
  const [{ type: subCommandType, options: subCommandOptions = [] }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const member = interactionConfig?.member;
  const userName = member?.user.username;
  const serverInfo = (await rest.get(
    (Routes as any).guild(interactionConfig.guild_id)
  )) as RESTGetAPIGuildResult;
  const serverName = serverInfo.name;
  const ownerId = serverInfo.owner_id;
  const serverRoles = serverInfo.roles;
  const serverProfile = await getServerProfile(
    { discordServerId: interactionConfig.guild_id },
    { documentClient }
  );
  const timeZone = getTimeZones().find(({value})=>{
    return value === serverProfile?.timezoneOffset;
  });
  logger.log("info", { serverInfo, serverName, ownerId });

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
