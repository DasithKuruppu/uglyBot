export enum availableEnvVariables {
  DISCORD_APPLICATION_ID = "DISCORD_APPLICATION_ID",
  DISCORD_TOKEN = "DISCORD_TOKEN",
  DISCORD_SERVER_ID = "DISCORD_SERVER_ID",
  DISCORD_BOT_NAME = "DISCORD_BOT_NAME",
  DISCORD_BOT_ID = "DISCORD_BOT_ID",
}

export const getEnvironmentVariables = () => {
  const discordApplicationID = process.env.DISCORD_APPLICATION_ID as string;
  const discordBotToken = process.env.DISCORD_TOKEN as string;
  const discordServerId = process.env.DISCORD_SERVER_ID as string;
  const discordBotName = process.env.DISCORD_BOT_NAME as string;
  const discordBotId = process.env.DISCORD_BOT_ID as string;
  return {
    discordApplicationID,
    discordBotToken,
    discordServerId,
    discordBotName,
    discordBotId,
  };
};
