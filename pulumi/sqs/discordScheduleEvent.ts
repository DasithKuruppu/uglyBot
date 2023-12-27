import { sqs } from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { discordScheduleEventsLambdaCallback } from "../lambdas/discordEventsScheduler";
const stack = pulumi.getStack();
const discordScheuleEventsDeadLetter = new sqs.Queue(
  `${stack}_discordScheduleEventsDeadLetter`,
  {
    fifoQueue: false,
    contentBasedDeduplication: false,
  }
);
const discordScheduleEventsQueue = new sqs.Queue(
  `${stack}_discordScheduleEvents`,
  {
    visibilityTimeoutSeconds: 30,
    messageRetentionSeconds: 300,
    fifoQueue: false,
    contentBasedDeduplication: false,
    redrivePolicy: pulumi.interpolate`{
    "deadLetterTargetArn": "${discordScheuleEventsDeadLetter.arn}",
    "maxReceiveCount": "1"
  }
`,
  }
);

discordScheduleEventsQueue.onEvent(
  "discordScheduleInteraction",
  discordScheduleEventsLambdaCallback,
  {
    batchSize: 1,
  }
);

export { discordScheduleEventsQueue };
