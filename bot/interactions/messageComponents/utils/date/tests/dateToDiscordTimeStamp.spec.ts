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
    const dateResult = convertToDiscordDate('2020-04-02T08:02:17-05:00');
    expect(dateResult).toBe(`<t:1585832537:F>`);
  });
});
