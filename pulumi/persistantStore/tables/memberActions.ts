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
      name: "serverId",
      type: "S",
    },
    {
      name: "memberName",
      type: "S",
    },
    {
      name: "className",
      type: "S",
    },
    {
      name: "characterName",
      type: "S",
    },
    {
      name: "inGameHandle",
      type: "S",
    },
    {
      name: "action",
      type: "S",
    },
    {
      name: "raidName",
      type: "S",
    },
    {
      name: "interactionType",
      type: "S",
    },
    {
      name: "interactedAgaintMember",
      type: "S",
    },
    {
      name: "interactionDescription",
      type: "S",
    },
    {
      name: "createdAt",
      type: "N", // number
    },
  ],
  billingMode: "PAY_PER_REQUEST",
  globalSecondaryIndexes: [
    {
      hashKey: "characterName",
      name: "characterNameIndex",
      nonKeyAttributes: [
        "serverId",
        "characterName",
        "inGameHandle",
        "discordMemberId",
      ],
      projectionType: "INCLUDE",
      rangeKey: "createdAt",
    },
  ],
  hashKey: "inGameHandle",
  rangeKey: "createdAt",
  tags: {
    Environment: `${getEnvironmentFromStack(stack)}`,
    Name: `${stack}_memberActions`,
  },
});
