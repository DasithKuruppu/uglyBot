// Your public key can be found on your application in the Developer Portal
import { APIGatewayProxyEvent } from "aws-lambda";
import winston from "winston";
import { verifyKey } from "discord-interactions";
import { InteractionType } from "discord.js";
import { userProfile } from "../modals/profile"
export const verifyRequest = (
  event: APIGatewayProxyEvent,
  factory: { logger: winston.Logger; strBody: string }
) => {
  const DISCORD_PUBLIC_KEY = process.env?.DISCORD_PUBLIC_KEY as string;
  const signature = event.headers["x-signature-ed25519"] || "";
  const timestamp = event.headers["x-signature-timestamp"] || "";
  // stops default base 64 encode more info on -
  // https://github.com/pulumi/pulumi-aws-apigateway/issues/30
  const { logger, strBody } = factory;
  const isValidRequest = verifyKey(
    strBody,
    signature,
    timestamp,
    DISCORD_PUBLIC_KEY
  );
  logger.log("info", "Verify info", {
    timestamp,
    signature,
    strBody,
    DISCORD_PUBLIC_KEY,
    isValidRequest
  });
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
  const requiresModalCommand = ["create profile"];
  const subCommandName =  body?.data?.options?.[0]?.name;
  const commandName = [body?.data?.name, subCommandName].join(" ");
  const isModalInteraction = requiresModalCommand.includes(commandName);
  const isMessageComponent = InteractionType.MessageComponent === body.type;
  const responseType = isModalInteraction ? "modalInteraction" : isMessageComponent ? "messageComponent" : "default";
  const responseTypes = {
    messageComponent: 6,
    modalInteraction: 9,
    default: 4
  }
  logger.log("info", "command info", {
    responseType,
    isModalInteraction,
    isMessageComponent,
    commandName
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      type: responseTypes[responseType],
      ...(!isModalInteraction && !isMessageComponent && {
        data: {
          content: `Please wait while I make some 🥞 pancakes...`,
        },
      }),
      ...(isModalInteraction) && {
        data: {
          ...userProfile,
        }
      },
    }),
  };
};
