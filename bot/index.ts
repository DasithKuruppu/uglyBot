import { initializeAll } from "./initializations";

export const startBot = () => {
  const { logger } = initializeAll();
  logger.log({
    level: "info",
    message: "Bot started !",
  });

  return { getLogger: () => logger };
};
