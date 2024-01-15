import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
import { userActionsProcessor } from "../../lambdas/userActionsProcessor";
const stack = pulumi.getStack();

export const botConvosTable = new aws.dynamodb.Table(
  `${stack}_botConvos`,
  {
    attributes: [
      {
        name: "discordMemberId",
        type: "S",
      },
      {
        name: "compositeTypeStamp",
        type: "S",
      },
    ],
    billingMode: "PAY_PER_REQUEST",
    tableClass: "STANDARD",
    hashKey: "discordMemberId",
    rangeKey: "compositeTypeStamp",
    streamViewType: "NEW_AND_OLD_IMAGES",
    streamEnabled: false,
    tags: {
      Environment: `${getEnvironmentFromStack(stack)}`,
      Name: `${stack}_botconvos`,
    },
  }
);

