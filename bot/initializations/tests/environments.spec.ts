import { beforeEach, describe, expect, test, vi } from 'vitest'
import { environmentsInitialize, DEVELOP_ENV_CONFIG_PATH } from '../environments';
import * as dotenv from 'dotenv';
import * as path from 'path'

const stubbedPath = '/stubbedPath/';
const mockedResolvePath = stubbedPath + DEVELOP_ENV_CONFIG_PATH.slice(1);
const mockEnvironmentDev = "DEVELOPMENT";
const mockEnvironmentUnsupported = "UNSUPPORTED";
// mock dependencies
vi.mock('dotenv', () => {
    return { config: vi.fn(() => ({ parsed: true })) }
});
vi.mock('path', () => {
    return { resolve: vi.fn(() => mockedResolvePath) }
});



describe('Environments Initialization - environmentsInitialize() fn', () => {
    beforeEach(()=>{
        vi.clearAllMocks();
        vi.restoreAllMocks();
        vi.resetModules();
    })
    // It seems like it is unable to clear global variables on each test with a provided util function, so vi.stubGlobal is called each test to provide the expected global variables on each test.
    test('should return a valid given the environment - DEVELOPMENT', () => {
        vi.stubGlobal('process', { ...process, env: { ...process.env, environment: mockEnvironmentDev }, cwd: () => stubbedPath });
        const environmentInit = environmentsInitialize();
        expect(process.env.environment).toBe(mockEnvironmentDev);
        expect(path.resolve).toBeCalledWith(stubbedPath, DEVELOP_ENV_CONFIG_PATH);
        expect(dotenv.config).toHaveBeenCalledWith({
            override: true,
            path: mockedResolvePath
        });
        expect(environmentInit).toEqual({ parsed: true });
    });

    test('should return a valid object with correct properties when no environment is specified', () => {
        vi.stubGlobal('process', { ...process, env: { ...process.env, environment: undefined }, cwd: () => stubbedPath });
        const environmentInit = environmentsInitialize();
        expect(process.env.environment).toBe(undefined);
        expect(path.resolve).toBeCalledWith(stubbedPath, DEVELOP_ENV_CONFIG_PATH);
        expect(dotenv.config).toHaveBeenCalledWith({
            override: true,
            path: mockedResolvePath
        });
        expect(environmentInit).toEqual({ parsed: true });
    });

    test('should return an error given an unsupported environment - UNSUPPORTED', () => {
        vi.stubGlobal('process', { ...process, env: { ...process.env, environment: mockEnvironmentUnsupported }, cwd: () => stubbedPath });
        const environmentInit = environmentsInitialize();
        expect(process.env.environment).toBe(mockEnvironmentUnsupported);
        expect(dotenv.config).toBeCalledTimes(0); 
        expect(environmentInit).toEqual({ error: new Error('Unsupported environment specified !') });
    });
});

