import { apiEndpoint } from "./apiGateway";
import { warmDiscordEventsSchedule } from "./lambdas/discordEventsProcessor";
import { warmHTTPEventsSchedule } from "./lambdas/httpEventsProcessor";
import { discordEventsQueue } from "./sqs/discordEvents";

export default {
  apiGatewayEndpointUrl: apiEndpoint.url,
  cloudwatchSchedule: {
    warmDiscordEventsSchedule: warmDiscordEventsSchedule.id,
    warmHTTPEventsSchedule: warmHTTPEventsSchedule.id,
  },
  sqs: {
    discordEventsUrl: discordEventsQueue.url,
  },
};
