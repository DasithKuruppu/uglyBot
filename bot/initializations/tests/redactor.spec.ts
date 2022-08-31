import { beforeEach, describe, expect, Mocked, test, vi } from 'vitest'
import { DEVELOPMENT } from '../environments';
import fastRedact from 'fast-redact';
import { dataRedactor, defaultRedactableData, censorMessage } from '../redactor';

vi.mock('fast-redact', () => ({
    default: vi.fn(() =>
        vi.fn(() => ({ mock: true }))
    )
}));

describe('Redactor - dataRedactor() fn', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
        vi.resetModules();
    })

    test('should return a valid redacted data object', () => {
        const dataObj = {
            DISCORD_TOKEN: 'sensitiveData',
        }
        const redactedData = dataRedactor(dataObj);
        expect(fastRedact).toBeCalledTimes(1);
        expect(fastRedact).toBeCalledWith({ paths: defaultRedactableData, censor: censorMessage });
        expect((fastRedact as unknown as Mocked<any>).results[0][1]).toBeCalledWith(dataObj);
        expect(redactedData).toEqual({ mock: true });
    });
});

