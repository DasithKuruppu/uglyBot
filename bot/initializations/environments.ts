import * as dotenv from "dotenv";
import process from "process";

export const DEVELOP_ENV_CONFIG_PATH = "/environmentConfigs/develop.env";
export const PRODUCTION_ENV_CONFIG_PATH = "/environmentConfigs/production.env";
export const STAGING_ENV_CONFIG_PATH = "/environmentConfigs/staging.env";
export const LAMBDA_DEVELOP_ENV_CONFIG_PATH =
  "/environmentConfigs/lambdadevelop.env";
export const LAMBDA_STAGING_ENV_CONFIG_PATH =
  "/environmentConfigs/lambdastaging.env";

export enum environmentTypes {
  DEVELOPMENT = "DEVELOPMENT",
  STAGING = "STAGING",
  PRODUCTION = "PRODUCTION",
  LAMBDA_DEVELOP = "LAMBDA_DEVELOP",
  LAMBDA_STAGING = "LAMBDA_STAGING",
}

const environmentsInitialize: () => dotenv.DotenvConfigOutput = () => {
  const currentEnv =
    (process.env.environment as environmentTypes) ||
    environmentTypes.DEVELOPMENT;
  const isLambdaEnv = [
    environmentTypes.LAMBDA_DEVELOP,
    environmentTypes.LAMBDA_STAGING,
  ].includes(currentEnv);
  const lambdaRootPath = process.env.LAMBDA_TASK_ROOT;
  // If its a LambdaEnv make no calls to process.cwd() due to pulumi serialization issues
  const currentPath = isLambdaEnv ? "" : process.cwd();
  const envPaths = {
    [environmentTypes.LAMBDA_DEVELOP]:
      lambdaRootPath + LAMBDA_DEVELOP_ENV_CONFIG_PATH,
    [environmentTypes.LAMBDA_STAGING]:
      lambdaRootPath + LAMBDA_STAGING_ENV_CONFIG_PATH,
    [environmentTypes.DEVELOPMENT]: currentPath + DEVELOP_ENV_CONFIG_PATH,
    [environmentTypes.PRODUCTION]: currentPath + PRODUCTION_ENV_CONFIG_PATH,
    [environmentTypes.STAGING]: currentPath + STAGING_ENV_CONFIG_PATH,
  };

  const supportedEnvironments: Array<string> = Object.keys(envPaths);
  const isEnvironmentSupported = supportedEnvironments.includes(currentEnv);

  const envConfiginitialization = isEnvironmentSupported
    ? dotenv.config({
        path: envPaths[currentEnv],
        override: false,
      })
    : { error: new Error("Unsupported environment specified !") };
  return envConfiginitialization;
};

export { environmentsInitialize };
