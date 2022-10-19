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
import { sectionTitleNames } from "../../../../../embeds/templates/neverwinter/raid";
import { Category } from "../../categorizeEmbedFields/categorizeEmbedFields";
import { createRaidContent, determineRaidTemplateType } from "../raid";

describe("Raid - createRaidContent", () => {
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
      {
        userActionText: testActivity,
        eventDate: "2020-10-06T17:41:28 GMT+03:00",
      }
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

describe.only("Raid - determineRaidTemplateType", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  test("Should return a valid object with template type and template seperation", () => {
    const result = determineRaidTemplateType({
      embedFields: [
        {
          name: sectionTitleNames.DPS_TITLE,
          value: "Capacity 1/6",
          inline: false,
        },
        { name: "Ranger(DPS)", value: `<@randomname>`, inline: true },
        { name: "Wizard(DPS)", value: `<@randomnameone>`, inline: true },
      ],
    });
    expect(result).toEqual({
      templateId: "1U2U0U0U0U0U0U0",
      templateMetaInfo: {
        [Category.DPS_TITLE]: {
          count: 1,
        },
        [Category.DPS]: {
          count: 2,
        },
        [Category.HEALER_TITLE]: {
          count: 0,
        },
        [Category.HEALER]: {
          count: 0,
        },
        [Category.TANK_TITLE]: {
          count: 0,
        },
        [Category.TANK]: {
          count: 0,
        },
        [Category.WAITLIST_TITLE]: {
          count: 0,
        },
        [Category.WAITLIST]: {
          count: 0,
        },
      },
    });
  });
});
