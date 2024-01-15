import { apiEndpoint } from "./apiGateway";
import { warmDiscordEventsSchedule } from "./lambdas/discordEventsProcessor";
import { warmHTTPEventsSchedule } from "./lambdas/httpEventsProcessor";
import { discordEventsQueue } from "./sqs/discordEvents";
import { membersTable } from "./persistantStore/tables/members";
import { raidsTable } from "./persistantStore/tables/raids";
import { memberActionsTable } from "./persistantStore/tables/memberActions";
import { userStatusTable } from "./persistantStore/tables/userStatus";
import { userNotifcations } from "./persistantStore/tables/userNotifications";
import { userProfileTable } from "./persistantStore/tables/userProfile";
import { userAvailabilityTable } from "./persistantStore/tables/userAvailability";
import { botConvosTable } from "./persistantStore/tables/botConvos";
export default {
  apiGatewayEndpointUrl: apiEndpoint.url,
  cloudwatchSchedule: {
    warmDiscordEventsSchedule: warmDiscordEventsSchedule.id,
    warmHTTPEventsSchedule: warmHTTPEventsSchedule.id,
  },
  sqs: {
    discordEventsUrl: discordEventsQueue.url,
  },
  persistantStore: {
    membersTable: membersTable.name,
    raidsTable: raidsTable.name,
    memberActionsTable: memberActionsTable.name,
    userStatusTable: userStatusTable.name,
    userNotifications: userNotifcations.name,
    userAvailabilityTable: userAvailabilityTable.name,
    userProfileTable: userProfileTable.name,
    botConvosTable: botConvosTable.name,
  },
};
