import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { getEnvironmentFromStack } from '../utils/stackEnvMap';
import { userActionsFactoryHandler } from "../../modules/userActionsProcessor";
const stack = pulumi.getStack();
export const userActionsProcessor = new aws.lambda.CallbackFunction(
  `${stack}_userActionsProcess`,
  {
    callbackFactory: userActionsFactoryHandler,
    timeout: 30,
    runtime: aws.lambda.Runtime.NodeJS16dX,
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
