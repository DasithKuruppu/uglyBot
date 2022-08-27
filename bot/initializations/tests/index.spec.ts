import { beforeEach, describe, expect, MockedFunction, MockInstance, test, vi } from "vitest";
import * as environments from "../environments";
import { loggerInitialize } from "../logger";
import { dataRedactor as redactor } from "../redactor";
import { initializeAll } from "../index";
import { DotenvConfigOutput } from "dotenv";

vi.mock("../logger", () => ({
  loggerInitialize: vi.fn(() => ({
    log: vi.fn(),
  })),
}));

vi.mock("../environments", async () => {
  const actualEnvironment = await vi.importActual<
    typeof import("../environments")
  >("../environments");
  return {
    ...actualEnvironment,
    environmentsInitialize: vi.fn(() => ({
      parsed: true,
    })),
  };
});

vi.mock("../redactor", () => ({
  dataRedactor: vi.fn(() => ({ parsed: true })),
}));

describe("Initializations - Index", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  test("should initialize logger and environment and log info of progress", () => {
    const { environmentsInitialize } = environments;
    const { logger, envConfiginitialization } = initializeAll();
    expect(loggerInitialize).toBeCalledTimes(1);
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toBeCalledWith({
      level: "info",
      message: "Logger initialized",
    });
    expect(environmentsInitialize).toBeCalledTimes(1);
    expect(redactor).toBeCalledTimes(1);
    expect(redactor).toBeCalledWith({ parsed: true });
    expect(logger.log).toBeCalledWith({
      level: "info",
      message: "Environment variables initialized",
      envConfiginitialization,
    });
  });

  test("should initialize logger and environment and log info of progress and given error", () => {
    const mockError = new Error("Error");
    (environments.environmentsInitialize as unknown as MockInstance).mockImplementationOnce(() => ({ error: mockError }));
    const { environmentsInitialize } = environments;
    const { logger } = initializeAll();
    expect(loggerInitialize).toBeCalledTimes(1);
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toBeCalledWith({
      level: "info",
      message: "Logger initialized",
    });
    expect(environmentsInitialize).toBeCalledTimes(1);
    expect(redactor).toBeCalledTimes(0);
    expect(logger.log).toBeCalledWith({
      level: "error",
      message: mockError.message,
      envConfiginitialization: mockError,
    });
  });
});
