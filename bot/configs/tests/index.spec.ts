import { beforeEach, describe, expect, test, vi } from "vitest";
import { getEnvironmentVariables, availableEnvVariables } from "../index";

describe("Configs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  test("getEnvironmentVariables", () => {
    vi.stubGlobal("process", {
      ...process,
      env: {
        ...process.env,
        [availableEnvVariables.DISCORD_APPLICATION_ID]: "mockTest",
        [availableEnvVariables.DISCORD_SERVER_ID]: "mockTest",
        [availableEnvVariables.DISCORD_TOKEN]: "mockTest",
      },
    });
    const envVariables = getEnvironmentVariables();
    expect(envVariables).toStrictEqual({
      discordApplicationID: "mockTest",
      discordBotToken: "mockTest",
      discordServerId: "mockTest",
    });
  });
});
