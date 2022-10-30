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
  billingMode: "PROVISIONED",
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
      readCapacity: 5,
      writeCapacity: 1,
    },
  ],
  hashKey: "inGameHandle",
  rangeKey: "createdAt",
  readCapacity: 5,
  tags: {
    Environment: `${getEnvironmentFromStack(stack)}`,
    Name: `${stack}_memberActions`,
  },
  writeCapacity: 2,
});
