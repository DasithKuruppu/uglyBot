import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import {
  coverageReplace,
  coverageRegexString,
  defaultCoverageReplaceOptions,
} from "../replaceReadmeContent";
import replace from "replace-in-file";

vi.mock("replace-in-file", () => ({
  default: {
    sync: vi.fn(() => ({ mock: true })),
  },
}));

describe("Utils - coverageReplace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  test("should call replace.sync() fn with the correct params", () => {
    const replaceResult = coverageReplace();
    expect(replace.sync).toHaveBeenCalledTimes(1);
    expect(replace.sync).toBeCalledWith(defaultCoverageReplaceOptions);
    const testRegex = new RegExp(coverageRegexString, "gim");
    const targetText = `![](https://img.shields.io/badge/Coverage-100%25-83A603.svg?color=blue&label=Total&prefix=$coverage$) ![](https://img.shields.io/badge/Coverage-100%25-83A603.svg?style=for-the-badge&logo=node.js&logoColor=white&color=blue&label=Statements&prefix=$statements$)`;
    const sampleText = `# READ ME

        ## Test coverage 
        
        
        ${targetText}
        
        [comment]: # (__TEST_COVERAGE_RESULTS__)`;
    const matchResult = sampleText.match(testRegex);
    expect(matchResult).toEqual([targetText]);
    expect(replaceResult).toEqual({ mock: true });
  });
});
