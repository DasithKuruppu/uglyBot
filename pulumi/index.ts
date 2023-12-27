import { apiEndpoint } from "./apiGateway";
import { discordEventsQueue } from "./sqs/discordEvents";
import { membersTable } from "./persistantStore/tables/members";
import { raidsTable } from "./persistantStore/tables/raids";
import { memberActionsTable } from "./persistantStore/tables/memberActions";
import { userStatusTable } from "./persistantStore/tables/userStatus";
import { userNotifcations } from "./persistantStore/tables/userNotifications";
import { userProfileTable } from "./persistantStore/tables/userProfile";
import { userAvailabilityTable } from "./persistantStore/tables/userAvailability";
// import { discordEventsLambdaCallback } from "./lambdas/discordEventsProcessor";
// import { discordScheduleEventsLambdaCallback } from "./lambdas/discordEventsScheduler";
// import { httpEventsProcessor } from "./lambdas/httpEventsProcessor";
// import { userActionsProcessor } from "./lambdas/userActionsProcessor";
// import { userrNotifcationsProcessor } from "./lambdas/userNotificationsProcessor";
// import { userRaidsProcessor } from "./lambdas/userRaidsProcessor";
// import { discordScheduleEventsQueue } from "./sqs/discordScheduleEvent";
const stackData = {
  apiGatewayEndpointUrl: apiEndpoint.url,
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
  },
  // lambdas: {
  //   discordEventsProcessor: discordEventsLambdaCallback.name,
  //   discordScheduleEventsProcessor: discordScheduleEventsLambdaCallback.name,
  //   httpEventsProcessor: httpEventsProcessor.name,
  //   userActionsProcessor: userActionsProcessor.name,
  //   userNotificationsProcessor: userrNotifcationsProcessor.name,
  //   userRaidsProcessor: userRaidsProcessor.name,
  // },
};
export default stackData;
