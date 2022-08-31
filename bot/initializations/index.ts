import { environmentsInitialize } from "./environments";
import { loggerInitialize } from "./logger";
import { dataRedactor } from "./redactor";

// Initialize the logger
export const initializeAll = () => {
  const logger = loggerInitialize();
  logger.log({
    level: "info",
    message: "Logger initialized",
  });

  // Initialize environment data and variables
  const envConfiginitialization = environmentsInitialize();
  const envConfigInitializedLoglevel = envConfiginitialization.error
    ? "error"
    : "info";
  logger.log({
    level: envConfigInitializedLoglevel,
    message: envConfiginitialization.error
      ? (envConfiginitialization.error as unknown as Error).message
      : "Environment variables initialized",
    envConfiginitialization: envConfiginitialization.error
      ? envConfiginitialization.error
      : dataRedactor(envConfiginitialization),
  });

  return { logger, envConfiginitialization };
};
