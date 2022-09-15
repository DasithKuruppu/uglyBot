export const getEnvironmentVariables = () => {
  const discordApplicationID = process.env.DISCORD_APPLICATION_ID as string;
  const discordBotToken = process.env.DISCORD_TOKEN as string;
  const discordServerId = process.env.DISCORD_SERVER_ID as string;
  return { discordApplicationID, discordBotToken, discordServerId };
};
