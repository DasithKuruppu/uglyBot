import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { getEnvironmentFromStack } from '../utils/stackEnvMap';
import { userNotificationsFactoryHandler } from "../../modules/userNotifications";
const stack = pulumi.getStack();
export const userrNotifcationsProcessor = new aws.lambda.CallbackFunction(
  `${stack}_userNotificationsProcessor`,
  {
    callbackFactory: userNotificationsFactoryHandler,
    runtime: aws.lambda.Runtime.NodeJS16dX,
    timeout: 30,
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

