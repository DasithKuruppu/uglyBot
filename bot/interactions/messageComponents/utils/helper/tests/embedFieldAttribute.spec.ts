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
import { ArtifactsNames } from "../../../../../embeds/templates/artifactsList";
import { trialNamesList } from "../../../../../registerCommands/commands";
import { Category } from "../../categorizeEmbedFields/categorizeEmbedFields";
import { extractFieldName } from "../embedFieldAttribute";

describe.only("embedFieldAttribute - extractFieldName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });
  test("Should extract a fieldName from a given attribute", () => {
    const extractedData = extractFieldName({fieldNameText:`<:Ranger:911695916505890837>|<:Paladin_Tank:911695915637686382>|<:Paladin_Heal:911695916510097458> Ranger(DPS)`});
   console.log({extractedData});
    expect(extractedData).toBe({})
    
  });
});
