import * as aws from "@pulumi/aws";
import { discordEventsLambdaCallback } from "../lambdas/discordEventsProcessor";
import { httpEventsProcessor } from "../lambdas/httpEventsProcessor";
const discordEventsQueue = new aws.sqs.Queue("discordEvents", {
  visibilityTimeoutSeconds: 180,
  messageRetentionSeconds: 300,
});

discordEventsQueue.onEvent(
  "discordInteraction",
  discordEventsLambdaCallback,
  { batchSize: 1 }
);

export { discordEventsQueue };
