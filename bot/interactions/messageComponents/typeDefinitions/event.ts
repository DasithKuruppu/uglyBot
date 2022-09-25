import { REST } from "@discordjs/rest";
import { APIMessage } from "discord-api-types/payloads/v10/channel";
import { APIInteractionGuildMember } from "discord-api-types/payloads/v10/interactions";
import { Logger } from "winston";

export interface IfactoryInitializations {
  logger: Logger;
  rest: REST;
  interactionConfig: {
    application_id: string;
    token: string;
    member: APIInteractionGuildMember;
    channel_id: string;
    message: APIMessage
  };
};
