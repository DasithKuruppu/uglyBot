import { REST } from "@discordjs/rest";
import { APIMessage } from "discord-api-types/payloads/v10/channel";
import { APIInteractionGuildMember } from "discord-api-types/payloads/v10/interactions";
import { Logger } from "winston";
import * as aws from "@pulumi/aws";
export interface IfactoryInitializations {
  logger: Logger;
  rest: REST;
  documentClient: any;
  interactionConfig: {
    application_id: string;
    token: string;
    member: APIInteractionGuildMember;
    channel_id: string;
    guild_id: string;
    message: APIMessage;
  };
}
