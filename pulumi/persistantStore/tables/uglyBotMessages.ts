import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
const stack = pulumi.getStack();

export const botMessagesTable = new aws.dynamodb.Table(`${stack}_botMessages`, {
  attributes: [
    {
      name: "discordMemberId",
      type: "S",
    },
    {
      name: "userName",
      type: "S",
    },
  ],
  billingMode: "PAY_PER_REQUEST",
  tableClass: "STANDARD",
  hashKey: "discordMemberId",
  rangeKey: "userName",
  tags: {
    Environment: `${getEnvironmentFromStack(stack)}`,
    Name: `${stack}botMessages`,
  },
});
