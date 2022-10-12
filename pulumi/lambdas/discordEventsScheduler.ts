import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { getEnvironmentFromStack } from '../utils/stackEnvMap';
import { discordScheduleEventsInteractionFactoryHandler } from "../../modules/discordScheduleEvents";
const stack = pulumi.getStack();
export const discordScheduleEventsLambdaCallback = new aws.lambda.CallbackFunction(
  `${stack}_discordEventsScheduler`,
  {
    callbackFactory: discordScheduleEventsInteractionFactoryHandler,
    runtime: aws.lambda.Runtime.NodeJS16dX,
    timeout: 10,
    environment: {
      variables: {
        environment: getEnvironmentFromStack(stack),
      },
    },
    codePathOptions: {
      extraIncludePaths: ["../environmentConfigs", "./logs"],
    },
    publish: true,
    memorySize: 256
  }
);

