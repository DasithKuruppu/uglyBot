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
  import { artifactsSort } from "../artifactsSorter";
  
  describe.only("artifactsSorter - artifactsSort", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.restoreAllMocks();
      vi.resetModules();
    });
  
    test("Should return a valid list of artifacts assigned for a user", () => {
      const result = artifactsSort();
      console.log(result);
      expect(result).toBe({});
    });
  
  });
  