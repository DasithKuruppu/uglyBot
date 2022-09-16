import { startBot } from "../../bot/";
import { REST } from "@discordjs/rest";
import { Routes, InteractionType } from "discord.js";
import {
  APIApplicationCommandInteraction,
  APIInteraction,
} from "discord-api-types/v10";
import { getEnvironmentVariables } from "../../bot/configs";
import {
  commandActions,
  recognizedCommands,
  unrecognizedCommand,
} from "../../bot/interactions/commands";

export const discordEventsInteractionFactoryHandler = () => {
  const { getLogger } = startBot();
  const logger = getLogger();
  return (event) => discordEventsProcessingFunction(event, { logger });
};

export const discordEventsProcessingFunction = async (
  event: AWSLambda.SQSEvent,
  { logger }
) => {
  const { discordBotToken } = getEnvironmentVariables();
  logger.log("info", "event recieved", event);
  const rest = new REST({ version: "10" }).setToken(discordBotToken);
  const { Records = [] } = event;
  const interactionData = Records.map(({ body }) =>
    JSON.parse(body)
  ) as APIInteraction[];

  const commandInteractionsData = interactionData.filter(
    ({ type }) => type === InteractionType.ApplicationCommand
  ) as APIApplicationCommandInteraction[];

  const commandInteractionResponses = commandInteractionsData.map(
    async ({ application_id, token, data, member }) => {
      const commandResponse = recognizedCommands.includes(data.name)
        ? await commandActions[data.name](data, {
            logger,
            rest,
            interactionConfig: { application_id, token, member },
          })
        : unrecognizedCommand();
      const responseResult = await rest.patch(
        (Routes as any).webhookMessage(application_id, token),
        commandResponse
      );
      return responseResult;
    }
  );

  const interactionResult = await Promise.all(commandInteractionResponses);
  logger.log("info", "interaction response sent", { interactionResult });
};
