import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { discordEventsLambdaCallback } from "../lambdas/discordEventsProcessor";

const discordEventsDeadLetter = new aws.sqs.Queue(
  "discordEventsDeadLetter",
  {
    fifoQueue: true,
    contentBasedDeduplication: true,
  }
);
const discordEventsQueue = new aws.sqs.Queue("discordEvents", {
  visibilityTimeoutSeconds: 30,
  messageRetentionSeconds: 300,
  fifoQueue: true,
  contentBasedDeduplication: true,
  redrivePolicy: pulumi.interpolate`{
    "deadLetterTargetArn": "${discordEventsDeadLetter.arn}",
    "maxReceiveCount": "1"
  }
`,
});

discordEventsQueue.onEvent("discordInteraction", discordEventsLambdaCallback, {
  batchSize: 1,
});

export { discordEventsQueue };
