// import * as aws from "@pulumi/aws";
// import * as pulumi from "@pulumi/pulumi";
// import { getEnvironmentFromStack } from '../utils/stackEnvMap';
// import { discordEventsInteractionFactoryHandler } from "../../modules/discordEventsProcessor";
// const stack = pulumi.getStack();
// export const discordEventsLambdaCallback = new aws.lambda.CallbackFunction(
//   `${stack}_userActionsProcess`,
//   {
//     callbackFactory: discordEventsInteractionFactoryHandler,
//     timeout: 60,
//     runtime: aws.lambda.Runtime.NodeJS16dX,
//     environment: {
//       variables: {
//         environment: getEnvironmentFromStack(stack),
//       },
//     },
//     codePathOptions: {
//       extraIncludePaths: ["../environmentConfigs", "./logs"],
//     },
//     publish: true,
//     memorySize: 768
//   }
// );

// // export const concurencyConfigFixed = new aws.lambda.ProvisionedConcurrencyConfig(`${stack}-discord-events-fixed-concurrency`, {
// //   functionName: discordEventsLambdaCallback.name,
// //   qualifier: discordEventsLambdaCallback.version,
// //   provisionedConcurrentExecutions: 2,
// // });
