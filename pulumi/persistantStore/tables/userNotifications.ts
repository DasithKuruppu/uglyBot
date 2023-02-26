import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
import { userrNotifcationsProcessor } from "../../lambdas/userNotificationsProcessor";
const stack = pulumi.getStack();

export const userNotifcations = new aws.dynamodb.Table(
  `${stack}_userNotifcations`,
  {
    attributes: [
      {
        name: "discordMemberId",
        type: "S",
      },
      {
        name: "raidId",
        type: "S",
      },
    ],
    billingMode: "PAY_PER_REQUEST",
    hashKey: "discordMemberId",
    rangeKey: "raidId",
    streamEnabled: true,
    streamViewType: "NEW_AND_OLD_IMAGES",
    ttl: {
      attributeName: "notifyTime",
      enabled: true,
    },
    tags: {
      Environment: `${getEnvironmentFromStack(stack)}`,
      Name: `${stack}_userNotifcations`,
    },
  }
);

userNotifcations.onEvent("userNotifcationTrigger", userrNotifcationsProcessor, {
  startingPosition: "TRIM_HORIZON",
  batchSize: 1,
  maximumRetryAttempts: 2,
});
