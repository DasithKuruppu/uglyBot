import { beforeEach, describe, expect, test, vi } from "vitest";
import { getOptionsList, NeverwinterClassesMap, ClassNames } from "../classesList";

describe("Configs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  test("getOptionsList", () => {
    const classOptionsList = getOptionsList();
    expect(classOptionsList.length).toBe(15);
    expect(classOptionsList).toBeInstanceOf(Array);
  });

  test("NeverwinterClassesMap", () => {
    const [[className, { type , emoji }]] = NeverwinterClassesMap;
    expect(NeverwinterClassesMap.length).toBe(15);
    expect(NeverwinterClassesMap).toBeInstanceOf(Array);
    expect(typeof className).toBe('string');
    expect(typeof type).toBe('string');
  });

  test("ClassNames", () => {
    expect(typeof ClassNames.BARB_DPS).toBe('string');
  });
});
