import {
  beforeEach,
  describe,
  expect,
  Mock,
  Mocked,
  MockedFunction,
  MockInstance,
  test,
  vi,
} from "vitest";

import { convertToDiscordDate } from '../dateToDiscordTimeStamp'

describe("User Actions - executeEmbedFieldActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  test.only("Should provide a proper discord long timestamp", () => {
    const dateResult = convertToDiscordDate('WTF');
    expect(dateResult).toBe(`<t:1664085660:F>`);
  });
});
