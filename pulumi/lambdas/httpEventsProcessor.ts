import * as aws from "@pulumi/aws";
import { httpEventsFactoryHandler } from "../../modules/httpEventsProcessor";
import { discordEventsQueue } from "../sqs/discordEvents";

export const httpEventsProcessor = new aws.lambda.CallbackFunction(
  "httpEventsProcess",
  {
    callbackFactory: () =>
      httpEventsFactoryHandler({
        DISCORD_EVENTS_SQS: discordEventsQueue.url.get(),
      }),
    // callback: uglyBot.main,
    // Only let this Lambda run for a minute before forcefully terminating it.
    timeout: 10,
    runtime: aws.lambda.Runtime.NodeJS16dX,
    environment: {
      variables: {
        environment: "LAMBDA_DEVELOP",
      },
    },
    codePathOptions: {
      extraIncludePaths: ["../environmentConfigs", "./logs"],
    },
  }
);
