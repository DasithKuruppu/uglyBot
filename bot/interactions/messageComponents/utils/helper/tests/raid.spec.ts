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
import { createRaidContent } from "../raid";

describe.only("Raid - createRaidContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  test("Should return a string with no event date", () => {
    const testActivity = "Test activity";
    const result = createRaidContent(
      `Last activity(2 hours ago) : 
        BrokenPumkin/UglyBee joined raid as Fighter(DPS) 
       `,
      { userActionText: testActivity }
    );
    const [eventDate, activityHeader, activityDescription] = result.split("\n");
    expect(activityDescription).toBe(testActivity);
    expect(eventDate).toBe("");
  });

  test("Should return a string with event date", () => {
    const testActivity = "Test activity";
    const result = createRaidContent(
      `Last activity(2 hours ago) : 
        BrokenPumkin/UglyBee joined raid as Fighter(DPS) 
       `,
      { userActionText: testActivity, eventDate: "2020-10-06T17:41:28 GMT+03:00" }
    );
    const [eventDate, activityHeader, activityDescription] = result.split("\n");
    expect(activityDescription).toBe(testActivity);
    expect(eventDate).toBe(`Event/Raid will start at <t:1601995288:F>`);
  });

  test("Should return a string with event date", () => {
    const testActivity = "Test activity";
    const result = createRaidContent(
      `Event/Raid will start at <t:1601995288:F>
       Last activity(2 hours ago) : 
       BrokenPumkin/UglyBee joined raid as Fighter(DPS) 
       `,
      { userActionText: testActivity }
    );
    const [eventDate, activityHeader, activityDescription] = result.split("\n");
    expect(activityDescription).toBe(testActivity);
    expect(eventDate).toBe(`Event/Raid will start at <t:1601995288:F>`);
  });
});
