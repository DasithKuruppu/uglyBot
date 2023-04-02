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
import { decompressMounts, mountsSort } from "../mountSorter";

describe("Mount sorter - decompress mounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });
  test("Should return a expanded denormalized list of mounts", () => {
    const category = "DPS" as Category;
    const mountsList = [
      {
        name: "Jim",
        category,
        artifacts: [],
        mounts: [MountNames.ECLIPSE, MountNames.RIMFIRE, MountNames.TOAD],
      },
      {
        name: "Karen",
        category,
        artifacts: [],
        mounts: [MountNames.ECLIPSE, MountNames.RIMFIRE, MountNames.TOAD],
      },
      {
        name: "Noob",
        category,
        artifacts: [],
        mounts: [MountNames.ECLIPSE, MountNames.RIMFIRE, MountNames.TOAD],
      },
    ];
    console.log({ category });
    // having this becuse commeinting this results in a weird type error
    const res = decompressArtifacts(mountsList as any);

    const result = decompressMounts(mountsList as any);
    expect(result.length).toBe(9);
  });
});

describe("mountsSorter - sortMountpriority", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });
  test("Should return an assigned set of mounts per user", () => {
    const category = "DPS" as any;
    const mountsList = [
      {
        name: "Jim",
        category,
        artifacts: [],
        mounts: [MountNames.ECLIPSE, MountNames.RIMFIRE, MountNames.TOAD],
      },
      {
        name: "Karen",
        category,
        artifacts: [],
        mounts: [MountNames.ECLIPSE, MountNames.RIMFIRE, MountNames.TOAD],
      },
    ];
    const result = mountsSort(mountsList, trialNamesList.COKM);
    expect(result).toStrictEqual({
      Jim: "Toad",
      Karen: "Toad",
    });
  });

  test("Should return an assigned set of mounts per user with DPS / Tank priorities", () => {
    const category = "DPS" as any;
    const TankCategory = "TANK" as any;
    const mountsList = [
      {
        name: "Jim",
        category,
        artifacts: [],
        mounts: [MountNames.ECLIPSE, MountNames.RIMFIRE, MountNames.TOAD],
      },
      {
        name: "Karen",
        category,
        artifacts: [],
        mounts: [MountNames.ECLIPSE, MountNames.RIMFIRE, MountNames.TOAD],
      },
      {
        name: "TankKaren",
        category: TankCategory,
        artifacts: [],
        mounts: [MountNames.ECLIPSE, MountNames.RIMFIRE, MountNames.TOAD],
      },
    ];
    const result = mountsSort(mountsList, trialNamesList.COKM);
    expect(result).toStrictEqual({
      Jim: MountNames.TOAD,
      Karen: MountNames.TOAD,
      TankKaren: MountNames.ECLIPSE,
    });
  });

  test("Should return an assigned set of mounts per user with DPS / Tank / Heal priorities", () => {
    const category = "DPS" as any;
    const TankCategory = "TANK" as any;
    const mountsList = [
      {
        name: "Jim",
        category,
        artifacts: [],
        mounts: [MountNames.ECLIPSE, MountNames.RIMFIRE, MountNames.TOAD],
      },
      {
        name: "Karen",
        category,
        artifacts: [],
        mounts: [MountNames.ECLIPSE, MountNames.RIMFIRE, MountNames.TOAD],
      },
      {
        name: "TankKaren",
        category: TankCategory,
        artifacts: [],
        mounts: [MountNames.ECLIPSE,MountNames.SWARM, MountNames.RIMFIRE, MountNames.TOAD],
      },
      {
        name: "HealKaren",
        category: TankCategory,
        artifacts: [],
        mounts: [
          MountNames.ECLIPSE,
          MountNames.SWARM,
          MountNames.RIMFIRE,
          MountNames.TOAD,
        ],
      },
    ];
    const result = mountsSort(mountsList, trialNamesList.COKM);
    expect(result).toStrictEqual({
      Jim: MountNames.TOAD,
      Karen: MountNames.TOAD,
      TankKaren: MountNames.SWARM,
      HealKaren: MountNames.ECLIPSE
    });
  });
});
