import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { getEnvironmentFromStack } from '../utils/stackEnvMap';
import { discordEventsInteractionFactoryHandler } from "../../modules/discordEventsProcessor";
const stack = pulumi.getStack();
export const discordEventsLambdaCallback = new aws.lambda.CallbackFunction(
  `${stack}_discordEventsProcess`,
  {
    callbackFactory: discordEventsInteractionFactoryHandler,
    timeout: 10,
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
    memorySize: 768
  }
);

// export const concurencyConfigFixed = new aws.lambda.ProvisionedConcurrencyConfig(`${stack}-discord-events-fixed-concurrency`, {
//   functionName: discordEventsLambdaCallback.name,
//   qualifier: discordEventsLambdaCallback.version,
//   provisionedConcurrentExecutions: 2,
// });

export const lambdaWarmRule = new aws.cloudwatch.EventRule(`${stack}_warmUpLambdaRule`, {
  scheduleExpression: "rate(5 minutes)",
  isEnabled: false,
});

export const eventBridgePermission = new aws.lambda.Permission(
  `${stack}_eventBridgeLambdaInvokeDiscordEvent`,
  {
    action: "lambda:InvokeFunction",
    function: discordEventsLambdaCallback.name,
    principal: "events.amazonaws.com", //aws.iam.Principals.EventsPrincipal.toString(),
    sourceArn: lambdaWarmRule.arn,
  }
);
export const warmDiscordEventsSchedule = new aws.cloudwatch.EventTarget(
  `${stack}_warmDiscordEventsProcessor`,
  {
    arn: discordEventsLambdaCallback.arn,
    rule: lambdaWarmRule.name,
    input: JSON.stringify({
      warmer: true,
      concurrency: 1,
    }),
  }
);
