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

  test("Should provide a proper discord long timestamp", () => {
    const dateResult = convertToDiscordDate('2022-09-25T11:31:00+05:30');
    expect(dateResult).toBe(`<t:1664085660:F>`);
  });
});
