import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
const stack = pulumi.getStack();

export const userProfileTable = new aws.dynamodb.Table(`${stack}_userProfile`, {
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
  hashKey: "discordMemberId",
  tableClass: "STANDARD",
  rangeKey: "userName",
  tags: {
    Environment: `${getEnvironmentFromStack(stack)}`,
    Name: `${stack}userProfile`,
  },
});
