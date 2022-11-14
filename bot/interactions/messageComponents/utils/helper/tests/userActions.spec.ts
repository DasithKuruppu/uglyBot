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
import { executeEmbedFieldsActions, IActions, Operation } from "../userActions";
import { Category } from "../../categorizeEmbedFields/categorizeEmbedFields";
import { APIEmbedField } from "discord-api-types/payloads/v10/channel";
import { NeverwinterClassesMap } from "../../../../../embeds/templates/neverwinter/classesList";
import { createFieldValue } from "../embedFieldAttribute";
import { availableSlotValue } from "../../../../../embeds/templates/neverwinter/raid";

describe("User Actions - executeEmbedFieldActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  const className = "Ranger";
  const seperatedSections = {
    [Category.DPS_TITLE]: [],
    [Category.DPS]: [
      {
        inline: true,
        value: availableSlotValue,
        name: className,
      },
      {
        inline: true,
        value: availableSlotValue,
        name: className,
      },
    ] as APIEmbedField[],
    [Category.TANK_TITLE]: [],
    [Category.TANK]: [],
    [Category.HEALER_TITLE]: [],
    [Category.HEALER]: [],
    [Category.WAITLIST_TITLE]: [],
    [Category.WAITLIST]: [],
  };
  test("Should return a valid list of embedFields after performing insert operation", () => {
    const testMemberId = "test12345";
    const testField = {
      inline: true,
      value: createFieldValue({ memberId: testMemberId }),
      name: className,
    };
    const action = {
      operation: Operation.INSERT,
      sectionName: Category.DPS,
      field: testField,
      index: 1,
    };

    const indexOneResult = executeEmbedFieldsActions({
      actionsList: [action],
      seperatedSections,
    });
    const indexTwoResult = executeEmbedFieldsActions({
      actionsList: [{ ...action, index: 2 }],
      seperatedSections,
    });
    const indexZeroResult = executeEmbedFieldsActions({
      actionsList: [{ ...action, index: 0 }],
      seperatedSections,
    });
    expect(indexOneResult).toStrictEqual({
      ...seperatedSections,
      [Category.DPS]: [
        seperatedSections[Category.DPS][0],
        testField,
      ] as APIEmbedField[],
    });

    expect(indexTwoResult).toStrictEqual({
      ...seperatedSections,
      [Category.DPS]: [
        ...seperatedSections[Category.DPS],
        testField,
      ] as APIEmbedField[],
    });

    expect(indexZeroResult).toStrictEqual({
      ...seperatedSections,
      [Category.DPS]: [
        testField,
        seperatedSections[Category.DPS][1],
      ] as APIEmbedField[],
    });
  });

  test("Should return a valid list of embedFields after performing a replace operation", () => {
    const testMemberId = "test12345";
    const testField = {
      inline: true,
      value: createFieldValue({ memberId: testMemberId }),
      name: className,
    };
    const action = {
      operation: Operation.REPLACE,
      sectionName: Category.DPS,
      field: testField,
      index: 1,
    };

    const indexOneResult = executeEmbedFieldsActions({
      actionsList: [action],
      seperatedSections,
    });
    const indexTwoResult = executeEmbedFieldsActions({
      actionsList: [{ ...action, index: 2 }],
      seperatedSections,
    });
    const indexZeroResult = executeEmbedFieldsActions({
      actionsList: [{ ...action, index: 0 }],
      seperatedSections,
    });
    expect(indexOneResult).toStrictEqual({
      ...seperatedSections,
      [Category.DPS]: [
        seperatedSections[Category.DPS][0],
        testField,
      ] as APIEmbedField[],
    });

    expect(indexTwoResult).toStrictEqual({
      ...seperatedSections,
      [Category.DPS]: [
        ...seperatedSections[Category.DPS],
        testField,
      ] as APIEmbedField[],
    });

    expect(indexZeroResult).toStrictEqual({
      ...seperatedSections,
      [Category.DPS]: [
        testField,
        seperatedSections[Category.DPS][1],
      ] as APIEmbedField[],
    });
  });

  test("Should return a valid list of embedFields after performing a remove operation", () => {
    const testMemberId = "test12345";
    const testField = {
      inline: true,
      value: createFieldValue({ memberId: testMemberId }),
      name: className,
    };
    const action = {
      operation: Operation.DELETE,
      sectionName: Category.DPS,
      field: testField,
      index: 1,
    };

    const indexOneResult = executeEmbedFieldsActions({
      actionsList: [action],
      seperatedSections,
    });
    const indexTwoResult = executeEmbedFieldsActions({
      actionsList: [{ ...action, index: 2 }],
      seperatedSections,
    });
    const indexZeroResult = executeEmbedFieldsActions({
      actionsList: [{ ...action, index: 0 }],
      seperatedSections,
    });
    expect(indexOneResult).toStrictEqual({
      ...seperatedSections,
      [Category.DPS]: [seperatedSections[Category.DPS][0],{...testField, value: availableSlotValue, name: Category.DPS }] as APIEmbedField[],
    });

    // expect(indexTwoResult).toStrictEqual({
    //   ...seperatedSections,
    //   [Category.DPS]: [...seperatedSections[Category.DPS]] as APIEmbedField[],
    // });

    // expect(indexZeroResult).toStrictEqual({
    //   ...seperatedSections,
    //   [Category.DPS]: [seperatedSections[Category.DPS][1]] as APIEmbedField[],
    // });
  });
});
