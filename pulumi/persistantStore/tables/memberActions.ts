import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
const stack = pulumi.getStack();

export const memberActionsTable = new aws.dynamodb.Table(`${stack}_memberActions`, {
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
  hashKey: "discordMemberId",
  rangeKey: "compositeRaidStatusDate",
  tags: {
    Environment: `${getEnvironmentFromStack(stack)}`,
    Name: `${stack}_memberActions`,
  },
});
