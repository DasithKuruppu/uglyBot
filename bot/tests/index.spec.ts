import { beforeEach, describe, expect, Mock, Mocked, MockedFunction, MockInstance, test, vi } from "vitest";
import { initializeAll } from "../initializations";
import { startBot } from '../index';

vi.mock("../initializations", () => ({
    initializeAll: vi.fn(() => ({
        logger: {
            log: vi.fn(),
        },
        envConfiginitialization: {
            parsed: true,
        }
    })),
}));


describe("Initializations Bot", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
        vi.resetModules();
    });

    test("should start bot", () => {
        startBot();
        expect(initializeAll).toHaveBeenCalledTimes(1);
        expect((initializeAll as unknown as Mocked<any>).results[0][1].logger.log).toHaveBeenCalledTimes(1);
        expect((initializeAll as unknown as Mocked<any>).results[0][1].logger.log).toBeCalledWith({
            level: 'info',
            message: 'Bot started !',
        });
    });

});
