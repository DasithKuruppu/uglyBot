import { Logger } from "winston";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js"
import { info } from "./commands";

export const syncDiscordCommands = async (
  { discordBotToken, discordApplicationID, discordServerId },
  { logger }: { logger: Logger }
) => {
  const rest = new REST({ version: "10" }).setToken(discordBotToken);
  const registerableCommandsList = [info];
  try {
    const response = await rest.put(
      Routes.applicationGuildCommands(discordApplicationID, discordServerId),
      {
        body: registerableCommandsList,
      }
    );
    logger.log("info", "Updated/Syned bot commands successfully", { response });
  } catch (error) {
    logger.log("error", "Failed to sync bot commands", error);
  }
};
