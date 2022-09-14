import { apiEndpoint } from "./apiGateway";
import { discordEventsQueue } from "./sqs/discordEvents";

export default {
  apiGatewayEndpointUrl: apiEndpoint.url,
  sqs: {
    discordEventsUrl: discordEventsQueue.url,
  },
};
