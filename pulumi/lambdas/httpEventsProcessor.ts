import { lambda } from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { httpEventsFactoryHandler } from "../../modules/httpEventsProcessor";
import { discordEventsQueue } from "../sqs/discordEvents";
import { discordScheduleEventsQueue } from "../sqs/discordScheduleEvent";
import { getEnvironmentFromStack } from "../utils/stackEnvMap";
const stack = pulumi.getStack();
export const httpEventsProcessor = new lambda.CallbackFunction(
  `${stack}_httpEventsProcess`,
  {
    callbackFactory: () =>
      httpEventsFactoryHandler({
        DISCORD_EVENTS_SQS: discordEventsQueue.url.get(),
        DISCORD_SCHEDULE_EVENTS_SQS: discordScheduleEventsQueue.url.get()
      }),
    // callback: uglyBot.main,
    // Only let this Lambda run for 10 secs before forcefully terminating it.
    timeout: 10,
    runtime: lambda.Runtime.NodeJS16dX,
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

// const lambdaWarmRuleHTTP = new aws.cloudwatch.EventRule(
//   `${stack}_warmUpLambdaRuleHTTP`,
//   {
//     scheduleExpression: "rate(5 minutes)",
//     isEnabled: true,
//   }
// );

// export const concurencyConfigFixed = new aws.lambda.ProvisionedConcurrencyConfig(`${stack}-http-events-fixed-concurrency`, {
//   functionName: httpEventsProcessor.name,
//   qualifier: httpEventsProcessor.version,
//   provisionedConcurrentExecutions: 2,
// });

// export const eventBridgePermission = new aws.lambda.Permission(
//   `${stack}_eventBridgeLambdaInvoke`,
//   {
//     action: "lambda:InvokeFunction",
//     function: httpEventsProcessor,
//     principal: "events.amazonaws.com", //aws.iam.Principals.EventsPrincipal.toString(),
//     sourceArn: lambdaWarmRuleHTTP.arn,
//   }
// );



// export const warmHTTPEventsSchedule = new aws.cloudwatch.EventTarget(
//   `${stack}_warmHTTPEventsProcessor`,
//   {
//     arn: httpEventsProcessor.arn,
//     rule: lambdaWarmRuleHTTP.name,
//     input: JSON.stringify({
//       warmer: true,
//       concurrency: 1,
//     }),
//   }
// );
