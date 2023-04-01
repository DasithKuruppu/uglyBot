import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getEnvironmentFromStack } from "../../utils/stackEnvMap";
const stack = pulumi.getStack();

export const userAvailabilityTable = new aws.dynamodb.Table(
  `${stack}_userAvailabilitySchedule`,
  {
    attributes: [
      {
        name: "discordMemberId",
        type: "S",
      },
      {
        name: "availabilitySpecified",
        type: "S",
      },
    ],
    billingMode: "PAY_PER_REQUEST",
    hashKey: "discordMemberId",
    rangeKey: "availabilitySpecified",
    tags: {
      Environment: `${getEnvironmentFromStack(stack)}`,
      Name: `${stack}userAvailability`,
    },
  }
);
