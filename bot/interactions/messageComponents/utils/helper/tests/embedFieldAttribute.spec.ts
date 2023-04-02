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
import { ClassNames } from "../../../../../embeds/templates/neverwinter/classesList";
import { extractFieldName } from "../embedFieldAttribute";

describe("embedFieldAttribute - extractFieldName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });
  test("Should extract a fieldName from a given attribute", () => {
    const extractedData = extractFieldName({fieldNameText:`<:Ranger:911695916505890837>|<:Paladin_Tank:911695915637686382>|<:Paladin_Heal:911695916510097458> Ranger(DPS)`});
    expect(extractedData).toStrictEqual({fieldName: ClassNames.RANGER_DPS, optionalClasses: [ClassNames.PALADIN_TANK, ClassNames.PALADIN_HEAL]})
    
  });
});
