import * as awsx from "@pulumi/awsx";
import { httpEventsProcessor } from "../lambdas/httpEventsProcessor"; 
/**
 * api-gatewayx https://www.pulumi.com/docs/guides/crosswalk/aws/api-gateway/
 */

// Create an API endpoint.
export const apiEndpoint = new awsx.apigateway.API("uglyBot", {
  routes: [
    {
      path: "/discordEvents",
      method: "POST",
      eventHandler: httpEventsProcessor,
    },
  ],
});
