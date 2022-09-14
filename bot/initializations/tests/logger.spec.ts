import { beforeEach, describe, expect, test, vi } from 'vitest'
import { loggerInitialize, config as logConfig } from '../logger';
import { environmentTypes } from '../environments';
import { createLogger, format, transports } from 'winston';


const mockTimeStamp = '[mock Time Stamp]';
const mockLoggerFormat = '[mock Logger Format]';
const mockErrors = '[mock Errors]';
const mockSplat = '[mock Splat]';
const mockPrettyPrint = '[mock PrettyPrint]';
const mockColorize = '[mock Colorize]';
const mockSimple = '[mock Simple]';
const mockConsoleTransport = '[mock Console Transport]';

vi.mock('winston', () => ({
    createLogger: vi.fn(() => ({ add: vi.fn() })),
    format: {
        timestamp: vi.fn(() => mockTimeStamp),
        errors: vi.fn(() => mockErrors),
        splat: vi.fn(() => mockSplat),
        prettyPrint: vi.fn(() => mockPrettyPrint),
        combine: vi.fn(() => mockLoggerFormat),
        colorize: vi.fn(() => mockColorize),
        simple: vi.fn(() => mockSimple)
    },
    transports: {
        File: vi.fn(({ filename }) => ({ filename })),
        Console: vi.fn(() => ({ mockConsoleTransport }))
    },
}));

describe('Logger Initialization - loggerInitialize() fn', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
        vi.resetModules();
    })
  
    test('should return a valid logger instance given the environment - DEVELOPMENT', () => {
        vi.stubGlobal('process', { ...process, env: { ...process.env, environment: environmentTypes.DEVELOPMENT } });
        const loggerInit = loggerInitialize();
        expect(process.env.environment).toBe(environmentTypes.DEVELOPMENT);
        expect(loggerInit).toMatchObject({ add: expect.any(Function) });
        
        expect(createLogger).toBeCalledTimes(1);
        expect(createLogger).toBeCalledWith({
            level: logConfig.logLevel,
            defaultMeta: { service: logConfig.serviceName },
            format: mockLoggerFormat,
            transports: [
                { filename: logConfig.errorLogFilePath },
                { filename: logConfig.combinedLogFilePath },
            ]
        });

        expect(format.combine).toBeCalledTimes(2);
        expect(format.combine).toBeCalledWith(mockTimeStamp, mockErrors, mockSplat, mockPrettyPrint);
        expect(format.combine).toBeCalledWith(mockSplat, mockColorize, mockSimple)

        expect(loggerInit.add).toBeCalledTimes(1);
        expect(loggerInit.add).toBeCalledWith({ mockConsoleTransport });
    });

    test('should return a valid logger instance given the environment - PRODUCTION', () => {
        vi.stubGlobal('process', { ...process, env: { ...process.env, environment: environmentTypes.PRODUCTION } });
        const loggerInit = loggerInitialize();
        expect(process.env.environment).toBe(environmentTypes.PRODUCTION);
        expect(loggerInit).toMatchObject({ add: expect.any(Function) });
        
        expect(createLogger).toBeCalledTimes(1);
        expect(createLogger).toBeCalledWith({
            level: logConfig.logLevel,
            defaultMeta: { service: logConfig.serviceName },
            format: mockLoggerFormat,
            transports: [
                { filename: logConfig.errorLogFilePath },
                { filename: logConfig.combinedLogFilePath },
            ]
        });

        expect(format.combine).toBeCalledTimes(1);
        expect(format.combine).toBeCalledWith(mockTimeStamp, mockErrors, mockSplat, mockPrettyPrint);
        expect(loggerInit.add).toBeCalledTimes(0);
    });
});

