import { createLogger, format, transports } from 'winston';
import { environmentTypes } from './environments';

export const config = {
    timeStampFormat: 'YYYY-MM-DD HH:mm:ss',
    serviceName: 'uglyBot',
    logLevel: 'info',
    errorLogFilePath: 'logs/ugly-bot-error.log',
    combinedLogFilePath: 'logs/ugly-bot-combined.log'
}

export const loggerInitialize = () => {
    const logger = createLogger({
        level: config.logLevel,
        format: format.combine(
            format.timestamp({
                format: config.timeStampFormat
            }),
            format.errors({ stack: true }),
            format.splat(),
            format.prettyPrint(),
        ),
        defaultMeta: { service: config.serviceName },
        transports: process.env?.environment !== environmentTypes.LAMBDA_DEVELOP ? [
            //
            // - Write to all logs with level `info` and below to `quick-start-combined.log`.
            // - Write all logs error (and below) to `quick-start-error.log`.
            //
            new transports.File({ filename: config.errorLogFilePath, level: 'error' }),
            new transports.File({ filename: config.combinedLogFilePath }),
        ] : []
    });

    //
    // If we're not in production then **ALSO** log to the `console`
    //
    if (process.env?.environment !== environmentTypes.PRODUCTION) {
        logger.add(new transports.Console({
            format: format.combine(
                format.splat(),
                format.simple(),
                format.json()
            )
        }));
    }

    return logger;
}

