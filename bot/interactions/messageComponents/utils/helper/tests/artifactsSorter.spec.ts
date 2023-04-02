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
import {
  artifactsSort,
  decompressArtifacts,
  sortArtifactPriority,
  groupDecompressedArtifacts,
  artifactPicker,
} from "../artifactsSorter";
import { MountNames } from "../../../../../embeds/templates/mountsList";
import { decompressMounts } from "../mountSorter";

describe("artifactsSorter - decompressArtifacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });
  test("Should return a expanded denormalized list of artifacts", () => {
    const category = "DPS" as Category;
    const artifactsList = [
      {
        name: "Jim",
        category,
        artifacts: [
          ArtifactsNames.BLACK_DRAGON,
          ArtifactsNames.BLADES,
          ArtifactsNames.WYVERN,
        ],
      },
      {
        name: "Karen",
        category,
        artifacts: [
          ArtifactsNames.BLACK_DRAGON,
          ArtifactsNames.BLADES,
          ArtifactsNames.CHARM,
        ],
      },
      {
        name: "Noob",
        category,
        artifacts: [
          ArtifactsNames.BLACK_DRAGON,
          ArtifactsNames.BLADES,
          ArtifactsNames.FEY_EMBLEM,
        ],
      },
    ];
    console.log({ category });
    const result = decompressArtifacts(artifactsList as any);
    expect(result.length).toBe(9);
  });
});

describe("artifactsSorter - sortArtifactPriority", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });
  test("Should return a expanded denormalized list of artifacts", () => {
    const category = "DPS" as Category;
    const artifactsList = [
      {
        name: "Jim",
        category: category,
        artifacts: [
          ArtifactsNames.WYVERN,
          ArtifactsNames.BLADES,
          ArtifactsNames.LANTERN,
        ],
        mounts: [],
      },
      {
        name: "Karen",
        category: category,
        artifacts: [
          ArtifactsNames.WYVERN,
          ArtifactsNames.BLADES,
          ArtifactsNames.ERRATIC_DRIFT_GLOBE,
        ],
        mounts: [],
      },
    ];
    const result = artifactsSort(artifactsList, trialNamesList.COKM);
    expect(result).toStrictEqual({
      Jim: ArtifactsNames.LANTERN,
      Karen: ArtifactsNames.WYVERN,
    });
  });

  
});
