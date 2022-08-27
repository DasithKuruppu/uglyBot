import { createLogger, format, transports } from 'winston';

const loggerInitialize = () => {
    const logger = createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.errors({ stack: true }),
            format.splat(),
            format.prettyPrint(),
        ),
        defaultMeta: { service: 'uglyBot' },
        transports: [
            //
            // - Write to all logs with level `info` and below to `quick-start-combined.log`.
            // - Write all logs error (and below) to `quick-start-error.log`.
            //
            new transports.File({ filename: 'logs/ugly-bot-error.log', level: 'error' }),
            new transports.File({ filename: 'logs/ugly-bot-combined.log' }),
        ]
    });

    //
    // If we're not in production then **ALSO** log to the `console`
    //
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new transports.Console({
            format: format.combine(
                format.splat(),
                format.colorize(),
                format.simple(),

            )
        }));
    }

    return logger;
}

export { loggerInitialize };
