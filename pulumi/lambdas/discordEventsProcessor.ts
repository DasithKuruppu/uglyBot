import * as aws from "@pulumi/aws";
import { discordEventsInteractionFactoryHandler } from "../../modules/discordEventsProcessor";

export const discordEventsLambdaCallback = new aws.lambda.CallbackFunction(
  "discordEventsProcess",
  {
    callbackFactory: discordEventsInteractionFactoryHandler,
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


export const lambdaWarmRule = new aws.cloudwatch.EventRule("warmUpLambdaRule", {
  scheduleExpression: "rate(5 minutes)",
  isEnabled: true,
});

export const eventBridgePermission = new aws.lambda.Permission(
  "eventBridgeLambdaInvokeDiscordEvent",
  {
    action: "lambda:InvokeFunction",
    function: discordEventsLambdaCallback.name,
    principal: "events.amazonaws.com", //aws.iam.Principals.EventsPrincipal.toString(),
    sourceArn: lambdaWarmRule.arn,
  }
);
export const warmDiscordEventsSchedule = new aws.cloudwatch.EventTarget(
  "warmDiscordEventsProcessor",
  {
    arn: discordEventsLambdaCallback.arn,
    rule: lambdaWarmRule.name,
    input: JSON.stringify({
      warmer: true,
      concurrency: 2,
    }),
  }
);
