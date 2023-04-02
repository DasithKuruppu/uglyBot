import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import {
  MountNames,
  MountsList,
  MountTypes,
} from "../../../../embeds/templates/mountsList";
import {
  availableSlotValue,
  previousAvailableSlotValue,
} from "../../../../embeds/templates/neverwinter/raid";
import { Category } from "../categorizeEmbedFields/categorizeEmbedFields";
import {
  extractFieldName,
  extractFieldValueAttributes,
} from "./embedFieldAttribute";
import { fieldSorter } from "./artifactsSorter";
import {
  previousTrialNamesList,
  trialNamesList,
} from "../../../../registerCommands/commands";

export const getStackingMounts = () =>
  (MountsList as any).reduce((prev, { shortName, nonStackingArtifact }) => {
    const foundInPrev = prev.find((stackingList) => {
      return stackingList.includes(shortName);
    });
    const isStacking =
      nonStackingArtifact && nonStackingArtifact.length >= 1 && !foundInPrev;
    return isStacking
      ? [...prev, [shortName, ...(nonStackingArtifact || [])]]
      : prev;
  }, [] as MountNames[][]);

export interface IpriorityMountOptions {
  mountsList?: typeof MountsList;
  userType?: Category;
  deprioritizeMitigationMounts?: boolean;
  deprioritizeUtilityMounts?: boolean;
  depriorotizeStackingMounts?: boolean;
  deprioritizeLevel?: number;
  availableMounts?: {
    name: string;
    category: Category;
    mounts: string[];
  }[];
}
export const getMountPriorityLevel = (
  mountShortName: string,
  {
    mountsList = [],
    userType = Category.DPS,
    deprioritizeMitigationMounts = true,
    deprioritizeUtilityMounts = true,
    depriorotizeStackingMounts = true,
    deprioritizeLevel = 20,
    availableMounts = [],
  }: IpriorityMountOptions = {}
) => {
  const stackingMounts = getStackingMounts();
  const availableStackingMountsCount = stackingMounts.reduce(
    (prev, stackingList = []) => {
      const currentStackingListCount = stackingList.map((mountName) => {
        return {
          mountName,
          count: availableMounts.filter(({ mounts = [] }) =>
            mounts.includes(mountName)
          ).length,
        };
      });
      return [...prev, currentStackingListCount.sort(fieldSorter(["-count"]))];
    },
    [] as any[]
  );

  const mountDetails = mountsList.find(
    ({ shortName }) => mountShortName === shortName
  );
  const isMitigationMount = mountDetails?.type.includes(MountTypes.MITIGATION);
  const isUtility = mountDetails?.type.includes(MountTypes.UTILITY);
  const isDebuff = mountDetails?.type.includes(MountTypes.DEBUFF);
  const isBuff = mountDetails?.type.includes(MountTypes.BUFF);
  const isBuffDebuff = isBuff || isDebuff;
  const isDamage = mountDetails?.type.includes(MountTypes.DAMAGE);
  const [firstStackingMount, ...otherStackingMounts] =
    availableStackingMountsCount.find((mountsStackingCountList) =>
      mountsStackingCountList
        .map(({ mountName }) => mountName)
        .includes(mountShortName)
    ) || [];
  const otherStackingMountsList = otherStackingMounts.map(
    ({ artifactName }) => artifactName
  );
  const dpsReducePriorityLevel =
    userType === Category.DPS && !isBuffDebuff && isDamage ? 0 : 4;
  const isSupportClass = [Category.HEALER, Category.TANK].includes(userType);
  const isTankSwarm =
    [Category.TANK].includes(userType) &&
    mountDetails?.shortName === MountNames.SWARM;
  const supportPriority = isSupportClass && isBuffDebuff;
  if (
    depriorotizeStackingMounts &&
    otherStackingMountsList.includes(mountShortName)
  ) {
    return deprioritizeLevel;
  }

  if (!isBuffDebuff && isMitigationMount && deprioritizeMitigationMounts) {
    return deprioritizeLevel;
  }

  if (
    !isBuffDebuff &&
    isUtility &&
    deprioritizeUtilityMounts &&
    (userType === Category.DPS || userType === Category.HEALER)
  ) {
    return deprioritizeLevel;
  }
  const tankPriority = isTankSwarm ? 1 : 0;
  const supportDefaultPriority =
    (mountDetails?.priority || 6) - (4 + tankPriority);
  const priorityLevel = supportPriority
    ? supportDefaultPriority
    : mountDetails?.priority || 0;
  console.log({
    priorityLevel,
    supportDefaultPriority,
    isTankSwarm,
    mountDetails,
    dpsReducePriorityLevel,
    isBuffDebuff,
    isBuff,
  });
  return Category.DPS === userType
    ? priorityLevel + dpsReducePriorityLevel
    : priorityLevel;
};

export const decompressMounts = (
  availableMountsList: {
    name: string;
    category: Category;
    mounts: string[];
  }[],
  {
    priorityOptions = {},
  }: {
    priorityOptions?: IpriorityMountOptions;
  } = {}
) => {
  return availableMountsList.reduce(
    (prev: any[], { name, category, mounts }) => {
      const mountDecompressData = mounts.map((mountShortName) => {
        const mountDetails = MountsList.find(
          ({ shortName }) => mountShortName === shortName
        );
        const usersWithMountCount = availableMountsList.reduce(
          (prevCount, { name, mounts: userMounts }) => {
            return userMounts.includes(mountShortName)
              ? prevCount + 1
              : prevCount;
          },
          0
        );
        const processedPriority = getMountPriorityLevel(mountShortName, {
          ...priorityOptions,
          userType: category,
          mountsList: MountsList,
          availableMounts: availableMountsList,
        });
        return {
          mountShortName,
          userName: name,
          mountsCount: mounts.length,
          usersWithMountCount,
          processedPriority,
          ...mountDetails,
        };
      });

      return [...prev, ...mountDecompressData];
    },
    []
  );
};

export const sortMountPriority = (
  decompressedArtifacts,
  {
    priority = ["processedPriority", "mountsCount", "usersWithMountCount"],
  } = {}
) => {
  return decompressedArtifacts.sort(fieldSorter(priority));
};

export const groupDecompressedMounts = (decompressedMounts) => {
  return decompressedMounts.reduce(
    (prev, { userName, mountShortName, processedPriority }) => {
      return {
        ...prev,
        [userName]: [...(prev[userName] || []), mountShortName],
      };
    },
    {}
  );
};

export const mountPicker = (groupedMounts) => {
  const groupEntriesList = Object.entries(groupedMounts);
  return groupEntriesList.reduce((prev, [userName, mounts], index) => {
    const exclusionList = [
      MountNames.TV,
      MountNames.BIGSBY,
      MountNames.TOAD,
      MountNames.WARHORSE,
    ];
    const assignableMount = (mounts as string[]).find((mountName) => {
      return (
        !prev?.assignedMounts?.includes(mountName) ||
        exclusionList.includes(mountName as MountNames)
      );
    });
    const isLastItem = index === groupEntriesList.length - 1;
    const returnResult = {
      ...prev,
      [userName]: assignableMount,
      assignedMounts: [...(prev?.assignedMounts || []), assignableMount],
    };
    const { assignedMounts, ...userAssignedList } = returnResult;
    return isLastItem ? userAssignedList : returnResult;
  }, {} as any);
};

export const mountsSort = (
  availableMountsList: {
    name: string;
    category: Category;
    mounts: string[];
    artifacts: string[];
  }[],
  raidName = "default"
) => {
  const requiresMitigation = {
    [trialNamesList.COKM]: false,
    [trialNamesList.TM]: false,
    [trialNamesList.TOMM]: true,
    [trialNamesList.ZCM]: true,
    [trialNamesList.TOSM]: false,
    [trialNamesList.GAZEMNIDS_RELIQUARY_M]: true,
    [previousTrialNamesList.GAZEMNIDS_RELIQUARY_M]: true,
    [previousTrialNamesList.COKM]: false,
    [previousTrialNamesList.TM]: false,
    [previousTrialNamesList.TOMM]: true,
    [previousTrialNamesList.ZCM]: true,
    [previousTrialNamesList.TOSM]: false,
    default: false,
  };
  const deprioritizeMitigationMounts = !requiresMitigation[raidName];
  const priorityOptions = {
    deprioritizeMitigationMounts,
    deprioritizeUtilityMounts: raidName !== trialNamesList.TOMM,
    deprioritizeStackingMounts: true,
  };
  const decompressedMounts = decompressMounts(availableMountsList, {
    priorityOptions,
  });
  console.log({ decompressedMounts });
  const sortResult = sortMountPriority(decompressedMounts);
  console.log({ sortResult });
  const groupedMounts = groupDecompressedMounts(sortResult);
  console.log({ groupedMounts });
  const pickedMounts = mountPicker(groupedMounts);
  return pickedMounts;
};
