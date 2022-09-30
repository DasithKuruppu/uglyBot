import * as aws from "@pulumi/aws";
import { discordEventsInteractionFactoryHandler } from '../../modules/discordEventsProcessor'
export const discordEventsLambdaCallback = new aws.lambda.CallbackFunction(
  "discordEventsProcess",
  {
    callbackFactory: discordEventsInteractionFactoryHandler,
    timeout: 60,
    runtime: aws.lambda.Runtime.NodeJS16dX,
    reservedConcurrentExecutions: 5,
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
