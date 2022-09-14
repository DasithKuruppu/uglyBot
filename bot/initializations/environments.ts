import * as dotenv from "dotenv";
import * as path from "path";
import process from "process";

export const DEVELOP_ENV_CONFIG_PATH = "/environmentConfigs/develop.env";
export const PRODUCTION_ENV_CONFIG_PATH = "/environmentConfigs/production.env";
export const LAMBDA_DEVELOP_ENV_CONFIG_PATH =
  "/environmentConfigs/lambdadevelop.env";

export enum environmentTypes {
  DEVELOPMENT = "DEVELOPMENT",
  PRODUCTION = "PRODUCTION",
  LAMBDA_DEVELOP = "LAMBDA_DEVELOP",
}

const environmentsInitialize: () => dotenv.DotenvConfigOutput = () => {
  const currentEnv =
    (process.env.environment as environmentTypes) ||
    environmentTypes.DEVELOPMENT;
  const isLambdaEnv = currentEnv === environmentTypes.LAMBDA_DEVELOP;
  const lambdaRootPath = process.env.LAMBDA_TASK_ROOT
  // If its a LambdaEnv make no calls to process.cwd() due to pulumi serialization issues
  const currentPath = isLambdaEnv ? "" : process.cwd();
  const envPaths = {
    [environmentTypes.LAMBDA_DEVELOP]: lambdaRootPath + LAMBDA_DEVELOP_ENV_CONFIG_PATH,
    [environmentTypes.DEVELOPMENT]: currentPath + DEVELOP_ENV_CONFIG_PATH,
    [environmentTypes.PRODUCTION]: currentPath + PRODUCTION_ENV_CONFIG_PATH,
  };

  const supportedEnvironments: Array<string> = Object.keys(envPaths);
  const isEnvironmentSupported = supportedEnvironments.includes(currentEnv);

  const envConfiginitialization = isEnvironmentSupported
    ? dotenv.config({
        path: envPaths[currentEnv],
        override: true,
      })
    : { error: new Error("Unsupported environment specified !") };
  return envConfiginitialization;
};

export { environmentsInitialize };
