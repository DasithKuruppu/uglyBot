import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
const stack = pulumi.getStack();

export const userStatusTable = new aws.dynamodb.Table(`${stack}_userStatus`, {
  attributes: [
    {
      name: "discordMemberId",
      type: "S",
    },
    {
      name: "userStatusInteraction",
      type: "S",
    },
  ],
  billingMode: "PAY_PER_REQUEST",
  hashKey: "discordMemberId",
  rangeKey: "userStatusInteraction",
  tags: {
    Environment: `${getEnvironmentFromStack(stack)}`,
    Name: `${stack}userStatus`,
  },
});
