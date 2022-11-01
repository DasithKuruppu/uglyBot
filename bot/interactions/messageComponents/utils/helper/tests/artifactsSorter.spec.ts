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
import { Category } from "../../categorizeEmbedFields/categorizeEmbedFields";
import { artifactsSort, decompressArtifacts, sortArtifactPriority, groupDecompressedArtifacts, artifactPicker} from "../artifactsSorter";

describe.only("artifactsSorter - decompressArtifacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });
  test("Should return a expanded denormalized list of artifacts", () => {
    const artifactsList = [
      {
        name: "Jim",
        category: Category.DPS,
        artifacts: [
          ArtifactsNames.BLACK_DRAGON,
          ArtifactsNames.BLADES,
          ArtifactsNames.WYVERN,
        ],
      },
      {
        name: "Karen",
        category: Category.DPS,
        artifacts: [
          ArtifactsNames.BLACK_DRAGON,
          ArtifactsNames.BLADES,
          ArtifactsNames.CHARM,
        ],
      },
      {
        name: "Noob",
        category: Category.DPS,
        artifacts: [
          ArtifactsNames.BLACK_DRAGON,
          ArtifactsNames.BLADES,
          ArtifactsNames.FEY_EMBLEM,
        ],
      },
    ];
    const result = decompressArtifacts(artifactsList);
    const sortResult = sortArtifactPriority(result);
    const finalArtifacts = groupDecompressedArtifacts(sortResult);
    const pickedArtifact = artifactPicker(finalArtifacts);
    console.log(pickedArtifact);
    expect(result).toBe([]);
  });
});
