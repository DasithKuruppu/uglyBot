import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
const stack = pulumi.getStack();
export const raidsTable = new aws.dynamodb.Table(`${stack}_raids`, {
  attributes: [
    {
      name: "raidId",
      type: "S"
    },
    {
      name: "creatorId",
      type: "S",
    },
    {
      name: "serverId",
      type: "S",
    },
    {
      name: "updatedAt",
      type: "N", // number
    },
    {
      name: "createdAt",
      type: "N", // number
    },
  ],
  billingMode: "PROVISIONED",
  hashKey: "raidId",
  rangeKey: "createdAt",
  readCapacity: 5,
  globalSecondaryIndexes: [
    {
      hashKey: "creatorId",
      name: "creatorIdIndex",
      nonKeyAttributes: [
        "raidId",
        "serverId",
        "updatedAt",
        "createdAt"
      ],
      projectionType: "INCLUDE",
      rangeKey: "serverId",
      readCapacity: 5,
      writeCapacity: 1,
    },
    {
      hashKey: "serverId",
      name: "serverIdIndex",
      nonKeyAttributes: [
        "raidId",
        "serverId",
        "updatedAt",
        "createdAt"
      ],
      projectionType: "INCLUDE",
      rangeKey: "creatorId",
      readCapacity: 5,
      writeCapacity: 1,
    },
    {
      hashKey: "serverId",
      name: "updatedLastIndex",
      nonKeyAttributes: [
        "raidId",
        "creatorId",
        "updatedAt",
        "createdAt"
      ],
      projectionType: "INCLUDE",
      rangeKey: "updatedAt",
      readCapacity: 5,
      writeCapacity: 1,
    },
  ],
  tags: {
    Environment: `${getEnvironmentFromStack(stack)}`,
    Name: `${stack}_raid`,
  },
  writeCapacity: 2,
});
