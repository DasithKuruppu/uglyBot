import { initializeAll } from "./initializations";

export const startBot = () => {
  const { logger, documentClient } = initializeAll();
  logger.log({
    level: "info",
    message: "Bot started !",
  });

  return { getLogger: () => logger, getDocumentClient: () => documentClient };
};
