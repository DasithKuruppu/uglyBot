import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { getEnvironmentFromStack } from '../utils/stackEnvMap';
import { raidsFactoryHandler } from "../../modules/raidsProcessor";
const stack = pulumi.getStack();
export const userRaidsProcessor = new aws.lambda.CallbackFunction(
  `${stack}_userRaidsProcessor`,
  {
    callbackFactory: raidsFactoryHandler,
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

