import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
import { userActionsProcessor } from "../../lambdas/userActionsProcessor";
const stack = pulumi.getStack();

export const memberActionsTable = new aws.dynamodb.Table(
  `${stack}_memberActions`,
  {
    attributes: [
      {
        name: "discordMemberId",
        type: "S",
      },
      {
        name: "compositeRaidStatusDate",
        type: "S",
      },
    ],
    billingMode: "PAY_PER_REQUEST",
    tableClass: "STANDARD",
    hashKey: "discordMemberId",
    rangeKey: "compositeRaidStatusDate",
    streamViewType: "NEW_AND_OLD_IMAGES",
    streamEnabled: true,
    tags: {
      Environment: `${getEnvironmentFromStack(stack)}`,
      Name: `${stack}_memberActions`,
    },
  }
);

memberActionsTable.onEvent("userActionsTrigger", userActionsProcessor, {
  startingPosition: "TRIM_HORIZON",
  batchSize: 5,
  maximumRetryAttempts: 2,
});
