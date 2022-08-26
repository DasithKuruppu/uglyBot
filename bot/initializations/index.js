import { environmentsInitialize } from './environments.js'
import { loggerInitialize } from './logger.js';
import { dataRedactor } from './redactor.js';

// Initialize the logger
const logger = loggerInitialize();
logger.log({
    level: 'info',
    message: 'Logger initialized',
});

// Initialize environment data and variables
const envConfiginitialization = environmentsInitialize();
const envConfigInitializedLoglevel = envConfiginitialization.error ? "error" : "info";
logger.log({
    level: envConfigInitializedLoglevel,
    message: 'Environment variables initialized',
    envConfiginitialization: dataRedactor(envConfiginitialization)
});




export { logger, dataRedactor };