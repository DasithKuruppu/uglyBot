import {
  APIChatInputApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataRoleOption,
  ApplicationCommandOptionType,
  REST,
  Routes,
  APIInteractionGuildMember,
} from "discord.js";
import { Logger } from "winston";

interface factoryInitializations {
  logger: Logger;
  rest: REST;
  interactionConfig: {
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
  "DPS"
];
export const disallowedRolesMessages = {
  Friend: ({ roleId }) =>
    `Sorry I am not allowed to assign this role - <@&${roleId}> , you could instead consider requesting friends with benefits <:laugh:973682040782323732>`,
};

export const requestRoleCommand = async (
  data: APIChatInputApplicationCommandInteractionData & { guild_id: string },
  factoryInits: factoryInitializations
) => {
  const { rest, logger, interactionConfig } = factoryInits;
  const resolvedRoles = data.resolved?.roles || {};
  const [{ type, value, name }] =
    data.options as APIApplicationCommandInteractionDataRoleOption[];

  if (type !== ApplicationCommandOptionType.Role) {
    return {
      body: {
        content: "Unsupported input, only a role could be specified",
      },
    };
  }

  const currentRole = resolvedRoles[value];
  const isAllowedRole = allowedRoles.includes(currentRole?.name);
  if (!isAllowedRole) {
    return {
      body: {
        content: Object.keys(disallowedRolesMessages).includes(currentRole.name)
          ? disallowedRolesMessages[currentRole?.name]({
              roleId: currentRole.id,
            })
          : `Sorry I am not allowed to assign the role - <@&${currentRole.id}>`,
      },
    };
  }
  const patchResult = await rest.put(
    (Routes as any).guildMemberRole(
      data?.guild_id as string,
      interactionConfig.member.user.id,
      currentRole.id
    )
  );
  logger.log("info", "role assigned", { patchResult });
  return {
    body: {
      content: `Requested role - <@&${currentRole.id}> assigned`,
    },
  };
};