import * as dotenv from 'dotenv';
import * as path from 'path'

const currentPath = process.cwd();
const currentEnv = process.env.environment || 'DEVELOPMENT';

const envPaths = {
    'DEVELOPMENT': path.resolve(currentPath, './environmentConfigs/develop.env'),
}

const environmentsInitialize = () => { 
    const envConfiginitialization = dotenv.config({
        path: envPaths[currentEnv],
        override: true
    });
    return envConfiginitialization
}

export { environmentsInitialize }

