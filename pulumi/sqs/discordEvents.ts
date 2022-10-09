import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { discordEventsLambdaCallback } from "../lambdas/discordEventsProcessor";
const stack = pulumi.getStack();
const discordEventsDeadLetter = new aws.sqs.Queue(
  `${stack}_discordEventsDeadLetter`,
  {
    fifoQueue: true,
    contentBasedDeduplication: true,
  }
);
const discordEventsQueue = new aws.sqs.Queue(`${stack}_discordEvents`, {
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
