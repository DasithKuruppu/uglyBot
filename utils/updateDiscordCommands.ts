// @ts-nocheck
import { initializeAll } from "../bot/initializations";
import { syncDiscordCommands } from "../bot/registerCommands/sync";
import { getEnvironmentVariables } from "../bot/configs";
export const updateDiscordBotCommands = () => {
  const { logger } = initializeAll();
  const { discordApplicationID, discordBotToken, discordServerId } =
    getEnvironmentVariables();
  logger.log("info", "updating discord bot commands using", {
    discordApplicationID,
    discordBotToken,
    discordServerId,
  });
  syncDiscordCommands(
    {
      discordBotToken,
      discordApplicationID,
      discordServerId,
    },
    { logger }
  );
};
