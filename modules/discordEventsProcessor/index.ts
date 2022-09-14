import { startBot } from "../../bot/";

export const discordEventsInteractionFactoryHandler = () => {
  const { getLogger } = startBot();
  const logger = getLogger();
  return (event) => discordEventsProcessingFunction(event, { logger });
};

export const discordEventsProcessingFunction = (event, { logger }) => {
  logger.log("info", "event recieved", event);
};