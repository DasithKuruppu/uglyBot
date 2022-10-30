import { apiEndpoint } from "./apiGateway";
import { warmDiscordEventsSchedule } from "./lambdas/discordEventsProcessor";
import { warmHTTPEventsSchedule } from "./lambdas/httpEventsProcessor";
import { discordEventsQueue } from "./sqs/discordEvents";
import { membersTable } from "./persistantStore/tables/members";
//import { memberActionsTable } from "./persistantStore/tables/memberActions";
export default {
  apiGatewayEndpointUrl: apiEndpoint.url,
  cloudwatchSchedule: {
    warmDiscordEventsSchedule: warmDiscordEventsSchedule.id,
    warmHTTPEventsSchedule: warmHTTPEventsSchedule.id,
  },
  sqs: {
    discordEventsUrl: discordEventsQueue.url,
  },
  persistantStore:{
    membersTable: membersTable.name,
    //memberActionsTable: memberActionsTable.name.get()
  }
};
