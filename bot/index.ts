import { logger } from './initializations'

const InitializeBot = () => {
    logger.log({
        level: 'info',
        message: 'Bot started !',
    });
}


export { InitializeBot };