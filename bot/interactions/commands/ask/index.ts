import {
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteractionData,
} from "discord.js";
import { Logger } from "winston";
export const commandName_ask = "ask";
export const askCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: any
) => {
  const { rest, logger, openAi, interactionConfig } = factoryInits;
  const [{ name: subCommandName, value: messageValue = [] }] =
    data.options as any[];
  const message = messageValue;
  const userId = interactionConfig.member?.user?.id;
  
  const response = await openAi.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    temperature: 0.5,
    max_tokens: 80,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  });
  logger.log("info", `response`, { response, message });
  return {
    body: {
      content: `<@${userId}> asked : ${message} \n>>> ${response.data?.choices?.[0].text}`,
    },
  };
};
