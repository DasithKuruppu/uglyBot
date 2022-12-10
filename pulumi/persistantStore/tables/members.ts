import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
const stack = pulumi.getStack();
export const membersTable = new aws.dynamodb.Table(`${stack}_members`, {
  attributes: [
    {
      name: "discordMemberId",
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
        "inGameHandle",
        "serverId",
        "className",
        "artifactsList"
      ],
      projectionType: "INCLUDE",
      rangeKey: "createdAt",
    },
    {
      hashKey: "className",
      name: "classNameIndex",
      nonKeyAttributes: [
        "inGameHandle",
        "serverId",
        "characterName",
        "artifactsList"
      ],
      projectionType: "INCLUDE",
      rangeKey: "createdAt",
    },
  ],
  hashKey: "discordMemberId",
  rangeKey: "className",
  tags: {
    Environment: `${getEnvironmentFromStack(stack)}`,
    Name: `${stack}_members`,
  },
});
