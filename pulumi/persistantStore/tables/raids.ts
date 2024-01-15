import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
import { userRaidsProcessor } from "../../lambdas/userRaidsProcessor";
const stack = pulumi.getStack();
export const raidsTable = new aws.dynamodb.Table(`${stack}_raids`, {
  attributes: [
    {
      name: "raidId",
      type: "S",
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
      name: "eventDiscordDateTime",
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
  billingMode: "PAY_PER_REQUEST",
  hashKey: "raidId",
  rangeKey: "createdAt",
  globalSecondaryIndexes: [
    {
      hashKey: "creatorId",
      name: "creatorIdIndex",
      nonKeyAttributes: ["raidId", "serverId", "updatedAt", "createdAt"],
      projectionType: "INCLUDE",
      rangeKey: "serverId",
    },
    {
      hashKey: "serverId",
      name: "serverIdIndex",
      nonKeyAttributes: ["raidId", "serverId", "updatedAt", "createdAt"],
      projectionType: "INCLUDE",
      rangeKey: "creatorId",
    },
    {
      hashKey: "serverId",
      name: "updatedLastIndex",
      projectionType: "ALL",
      rangeKey: "updatedAt",
    },
    {
      hashKey: "serverId",
      name: "eventTimeIndex",
      projectionType: "ALL",
      rangeKey: "eventDiscordDateTime",
    },
  ],
  tags: {
    Environment: `${getEnvironmentFromStack(stack)}`,
    Name: `${stack}_raid`,
  },
  tableClass: "STANDARD",
  streamViewType: "NEW_AND_OLD_IMAGES",
  streamEnabled: true,
});

raidsTable.onEvent("userRaidsTrigger", userRaidsProcessor, {
  startingPosition: "TRIM_HORIZON",
  batchSize: 2,
  maximumRetryAttempts: 2,
});