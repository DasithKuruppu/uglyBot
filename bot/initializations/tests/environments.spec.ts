import { beforeEach, describe, expect, test, vi } from "vitest";
import * as dotenv from "dotenv";
import {
    environmentsInitialize,
    DEVELOP_ENV_CONFIG_PATH,
    environmentTypes
  } from "../environments";

const stubbedPath = "/stubbedPath";
const mockedResolvePath = stubbedPath + DEVELOP_ENV_CONFIG_PATH;
const mockEnvironmentUnsupported = "UNSUPPORTED";
// mock dependencies
vi.mock("dotenv", () => {
  return { config: vi.fn(() => ({ parsed: true })) };
});
vi.mock("process", () => {
  return {
    default: {
      env: { environment: vi.fn() },
      cwd: vi.fn(),
    },
  };
});

describe("Environments Initialization - environmentsInitialize() fn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });
  // It seems like it is unable to clear global variables on each test with a provided util function, so vi.stubGlobal is called each test to provide the expected global variables on each test.
  test("should return a valid object given the environment - DEVELOPMENT", async () => {
    const process = await import("process");
    process.default.env = { environment: environmentTypes.DEVELOPMENT };
    process.default.cwd = vi.fn(()=> stubbedPath)
    const environmentInit = environmentsInitialize();
    // expect(path.resolve).toBeCalledWith(stubbedPath, DEVELOP_ENV_CONFIG_PATH);
    expect(dotenv.config).toHaveBeenCalledWith({
      override: false,
      path: mockedResolvePath,
    });
    expect(environmentInit).toEqual({ parsed: true });
  });

  test("should return a valid object with correct properties when no environment is specified", async () => {
    const process = await import("process");
    process.default.env = { environment: undefined };
    process.default.cwd = vi.fn(()=> stubbedPath)
    const environmentInit = environmentsInitialize();
    //expect(path.resolve).toBeCalledWith(stubbedPath, DEVELOP_ENV_CONFIG_PATH);
    expect(dotenv.config).toHaveBeenCalledWith({
      override: false,
      path: mockedResolvePath,
    });
    expect(environmentInit).toEqual({ parsed: true });
  });

  test("should return an error given an unsupported environment - UNSUPPORTED", async() => {
    const process = await import("process");
    process.default.env = { environment: mockEnvironmentUnsupported };
    process.default.cwd = vi.fn(()=> stubbedPath)
    const environmentInit = environmentsInitialize();
    expect(dotenv.config).toBeCalledTimes(0);
    expect(environmentInit).toEqual({
      error: new Error("Unsupported environment specified !"),
    });
  });
});
