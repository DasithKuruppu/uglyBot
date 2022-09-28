// Your public key can be found on your application in the Developer Portal
import { APIGatewayProxyEvent } from "aws-lambda";
import winston from "winston";
import { verifyKey } from "discord-interactions";
import { InteractionType } from "discord.js";
export const verifyRequest = (
  event: APIGatewayProxyEvent,
  factory: { logger: winston.Logger }
) => {
  const DISCORD_PUBLIC_KEY = process.env?.DISCORD_PUBLIC_KEY as string;
  const signature = event.headers["x-signature-ed25519"] || "";
  const timestamp = event.headers["x-signature-timestamp"] || "";
  // stops default base 64 encode more info on -
  // https://github.com/pulumi/pulumi-aws-apigateway/issues/30
  const isEmptyEventBody = event.body == null && event.body == undefined;
  const eventBody = !isEmptyEventBody ? (event.body as string) : "";
  const strBody = event.isBase64Encoded
    ? Buffer.from(eventBody, "base64").toString("utf8")
    : eventBody;
  const { logger } = factory;

  const isValidRequest = verifyKey(
    strBody,
    signature,
    timestamp,
    DISCORD_PUBLIC_KEY
  );
  logger.log("info", "Verifiy info", {
    timestamp,
    signature,
    strBody,
    DISCORD_PUBLIC_KEY,
  });
  logger.log("info", "Request verify status", { isValidRequest });
  if (!isValidRequest) {
    return {
      statusCode: 401,
      body: JSON.stringify("invalid request signature"),
    };
  }

  const body = JSON.parse(strBody);
  if (body.type == 1) {
    return {
      statusCode: 200,
      body: JSON.stringify({ type: 1 }),
    };
  }
  const isMessageComponent = InteractionType.MessageComponent === body.type;
  return {
    statusCode: 200,
    body: JSON.stringify({
      type: isMessageComponent ? 6 : 5,
    }),
  };
};
