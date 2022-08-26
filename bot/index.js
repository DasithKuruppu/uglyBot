import { logger } from './initializations/index.js'

const InitializeBot = () => {
    logger.log({
        level: 'info',
        message: 'Bot started !',
    });
}


export { InitializeBot };