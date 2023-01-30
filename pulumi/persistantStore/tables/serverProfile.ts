import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
const stack = pulumi.getStack();

export const serverProfileTable = new aws.dynamodb.Table(`${stack}_serverProfile`, {
  attributes: [
    {
      name: "discordServerId",
      type: "S",
    },
    {
      name: "ownerId",
      type: "S",
    },
  ],
  billingMode: "PAY_PER_REQUEST",
  hashKey: "discordServerId",
  rangeKey: "ownerId",
  tags: {
    Environment: `${getEnvironmentFromStack(stack)}`,
    Name: `${stack}serverProfile`,
  },
});
