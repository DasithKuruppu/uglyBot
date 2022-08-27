import { beforeEach, describe, expect, Mock, Mocked, MockedFunction, MockInstance, test, vi } from "vitest";
import { startBot } from '../bot';
import { main } from '../index';

vi.mock("../bot", () => ({
    startBot: vi.fn(),
}));


describe("Main - Index", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
        vi.resetModules();
    });

    test("should start bot", () => {
        main();
        expect(startBot).toHaveBeenCalledTimes(1);
    });

});
