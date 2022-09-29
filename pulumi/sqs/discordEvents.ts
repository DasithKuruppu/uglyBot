import * as aws from "@pulumi/aws";
import { discordEventsLambdaCallback } from "../lambdas/discordEventsProcessor";

const discordEventsQueue = new aws.sqs.Queue("discordEvents", {
  visibilityTimeoutSeconds: 180,
  messageRetentionSeconds: 300,
  fifoQueue: true,
  contentBasedDeduplication: true
});

discordEventsQueue.onEvent(
  "discordInteraction",
  discordEventsLambdaCallback,
  { batchSize: 1 }
);

export { discordEventsQueue };
