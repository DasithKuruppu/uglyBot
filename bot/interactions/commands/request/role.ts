import {
  APIChatInputApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataRoleOption,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
  APIApplicationCommandInteractionDataSubcommandOption,
} from "discord.js";
import { Logger } from "winston";

interface factoryInitializations {
  logger: Logger;
  rest: REST;
  interactionConfig: {
    guild_id: string;
    application_id: string;
    token: string;
    member: APIInteractionGuildMember;
  };
}

export const allowedRoles = [
  "Master Wiper",
  "Trainee",
  "Healer",
  "Buffer",
  "Tank",
  "Floor Inspector",
  "DPS",
  "Tester",
  "Barely Completed TOMM",
  "Hell Pit Completed",
  "Spider Wipe Completed",
];
export const disallowedRolesMessages = {
  Friend: ({ roleId }) =>
    `Sorry I am not allowed to assign this role - <@&${roleId}> , you could instead consider requesting friends with benefits <:laugh:973682040782323732>`,
};

export const requestRoleCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: factoryInitializations
) => {
  const { rest, logger, interactionConfig } = factoryInits;
  const { guild_id } = interactionConfig;
  const resolvedRoles = data.resolved?.roles || {};
  const [{ type: commandType, options: subCommandOptions = [] }] =
    data.options as APIApplicationCommandInteractionDataSubcommandOption[];
  const [{ type, value: roleName = "" }] =
    subCommandOptions as APIApplicationCommandInteractionDataRoleOption[];
  if (
    commandType !== ApplicationCommandOptionType.Subcommand ||
    type != ApplicationCommandOptionType.Role
  ) {
    return {
      body: {
        content: "Unsupported input",
      },
    };
  }

  const currentRole = resolvedRoles[roleName];
  const isAllowedRole = allowedRoles.includes(currentRole?.name);
  if (!isAllowedRole) {
    return {
      body: {
        content: Object.keys(disallowedRolesMessages).includes(currentRole.name)
          ? disallowedRolesMessages[currentRole?.name]({
              roleId: currentRole.id,
            })
          : `Sorry I am not allowed to assign the role - <@&${currentRole.id}>`,
        allowed_mentions: {
          parse: [],
        },
      },
    };
  }
  try {
    const patchResult = await rest.put(
      (Routes as any).guildMemberRole(
        guild_id as string,
        interactionConfig.member.user.id,
        currentRole.id
      )
    );
    logger.log("info", "role assigned", { patchResult });
  } catch (error) {
    logger.error("info", "error assigning role", { error });
    return {
      body: {
        content: Object.keys(disallowedRolesMessages).includes(currentRole.name)
          ? disallowedRolesMessages[currentRole?.name]({
              roleId: currentRole.id,
            })
          : `Sorry I am not allowed to assign the role - <@&${currentRole.id}>`,
        allowed_mentions: {
          parse: [],
        },
      },
    };
  }

  return {
    body: {
      content: `Requested role - <@&${currentRole.id}> assigned`,
      allowed_mentions: {
        parse: [],
      },
    },
  };
};
