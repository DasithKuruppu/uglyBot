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
  billingMode: "PROVISIONED",
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
      readCapacity: 5,
      writeCapacity: 1,
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
      readCapacity: 5,
      writeCapacity: 1,
    },
  ],
  hashKey: "discordMemberId",
  rangeKey: "className",
  readCapacity: 5,
  tags: {
    Environment: `${getEnvironmentFromStack(stack)}`,
    Name: `${stack}_members`,
  },
  writeCapacity: 2,
});
