import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { httpEventsFactoryHandler } from "../../modules/httpEventsProcessor";
import { discordEventsQueue } from "../sqs/discordEvents";
import { getEnvironmentFromStack } from "../utils/stackEnvMap";
const stack = pulumi.getStack();
export const httpEventsProcessor = new aws.lambda.CallbackFunction(
  `${stack}_httpEventsProcess`,
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
        environment: getEnvironmentFromStack(stack),
      },
    },
    codePathOptions: {
      extraIncludePaths: ["../environmentConfigs", "./logs"],
    },
    publish: true,
  }
);

const lambdaWarmRuleHTTP = new aws.cloudwatch.EventRule(
  `${stack}_warmUpLambdaRuleHTTP`,
  {
    scheduleExpression: "rate(5 minutes)",
    isEnabled: true,
  }
);

export const concurencyConfigFixed = new aws.lambda.ProvisionedConcurrencyConfig(`${stack}-http-events-fixed-concurrency`, {
  functionName: httpEventsProcessor.name,
  qualifier: httpEventsProcessor.version,
  provisionedConcurrentExecutions: 2,
});

export const eventBridgePermission = new aws.lambda.Permission(
  `${stack}_eventBridgeLambdaInvoke`,
  {
    action: "lambda:InvokeFunction",
    function: httpEventsProcessor,
    principal: "events.amazonaws.com", //aws.iam.Principals.EventsPrincipal.toString(),
    sourceArn: lambdaWarmRuleHTTP.arn,
  }
);



export const warmHTTPEventsSchedule = new aws.cloudwatch.EventTarget(
  `${stack}_warmHTTPEventsProcessor`,
  {
    arn: httpEventsProcessor.arn,
    rule: lambdaWarmRuleHTTP.name,
    input: JSON.stringify({
      warmer: true,
      concurrency: 2,
    }),
  }
);
