import * as dotenv from 'dotenv';
import * as path from 'path'

export const DEVELOP_ENV_CONFIG_PATH = './environmentConfigs/develop.env';
export const PRODUCTION_ENV_CONFIG_PATH = './environmentConfigs/production.env';

export const DEVELOPMENT = 'DEVELOPMENT';
export const PRODUCTION = 'PRODUCTION';

const environmentsInitialize: () => dotenv.DotenvConfigOutput = () => {
    const currentPath = process.cwd();
    const currentEnv = process.env.environment || DEVELOPMENT;

    const envPaths = {
        [DEVELOPMENT]: path.resolve(currentPath, DEVELOP_ENV_CONFIG_PATH),
        [PRODUCTION]: path.resolve(currentPath, PRODUCTION_ENV_CONFIG_PATH)
    }

    const supportedEnvironments: Array<string> = Object.keys(envPaths);
    const isEnvironmentSupported = supportedEnvironments.includes(currentEnv);


    const envConfiginitialization = isEnvironmentSupported ? dotenv.config({
        path: envPaths[currentEnv],
        override: true
    }) : { error: new Error('Unsupported environment specified !') };
    return envConfiginitialization
}

export { environmentsInitialize }

