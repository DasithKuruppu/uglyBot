import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import {
  CompanionNames,
  CompanionList,
  CompanionTypes,
} from "../../../../embeds/templates/companionsList";
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

export const getStackingCompanions = () =>
  (CompanionList as any).reduce((prev, { shortName, nonStackingCompanion }) => {
    const foundInPrev = prev.find((stackingList) => {
      return stackingList.includes(shortName);
    });
    const isStacking =
      nonStackingCompanion && nonStackingCompanion.length >= 1 && !foundInPrev;
    return isStacking
      ? [...prev, [shortName, ...(nonStackingCompanion || [])]]
      : prev;
  }, [] as CompanionNames[][]);

export interface IpriorityCompanionOptions {
  companionList?: typeof CompanionList;
  userType?: Category;
  deprioritizeMitigationCompanions?: boolean;
  deprioritizeUtilityCompanions?: boolean;
  depriorotizeStackingCompanions?: boolean;
  deprioritizeLevel?: number;
  availableCompanions?: {
    name: string;
    category: Category;
    mounts: string[];
    companions: string[];
  }[];
}
export const getCompanionPriorityLevel = (
  companionShortName: string,
  {
    companionList = [],
    userType = Category.DPS,
    deprioritizeMitigationCompanions = true,
    deprioritizeUtilityCompanions = true,
    depriorotizeStackingCompanions = true,
    deprioritizeLevel = 20,
    availableCompanions = [],
  }: IpriorityCompanionOptions = {}
) => {
  const stackingCompanions = getStackingCompanions();
  const availableStackingCompanionsCount = stackingCompanions.reduce(
    (prev, stackingList = []) => {
      const currentStackingListCount = stackingList.map((companionName) => {
        return {
          companionName,
          count: availableCompanions.filter(({ companions = [] }) =>
            companions.includes(companionName)
          ).length,
        };
      });
      return [...prev, currentStackingListCount.sort(fieldSorter(["-count"]))];
    },
    [] as any[]
  );

  const companionDetails = companionList.find(
    ({ shortName }) => companionShortName === shortName
  );
  const isMitigationCompanion = companionDetails?.type.includes(
    CompanionTypes.MITIGATION
  );
  const isUtility = companionDetails?.type.includes(CompanionTypes.UTILITY);
  const isDebuff = companionDetails?.type.includes(CompanionTypes.DEBUFF);
  const isBuff = companionDetails?.type.includes(CompanionTypes.BUFF);
  const isBuffDebuff = isBuff || isDebuff;
  const isDamage = companionDetails?.type.includes(CompanionTypes.DAMAGE);
  const [firstStackingMount, ...otherStackingCompanions] =
    availableStackingCompanionsCount.find((stackingCountList) =>
      stackingCountList
        .map(({ companionName }) => companionName)
        .includes(companionShortName)
    ) || [];
  const dpsReducePriorityLevel =
    userType === Category.DPS && !isBuffDebuff && isDamage ? 0 : 4;
  const isSupportClass = [Category.HEALER, Category.TANK].includes(userType);
  const supportPriority = isSupportClass && isBuffDebuff;
  if (
    depriorotizeStackingCompanions &&
    otherStackingCompanions.includes(companionShortName)
  ) {
    return deprioritizeLevel;
  }

  if (
    !isBuffDebuff &&
    isMitigationCompanion &&
    deprioritizeMitigationCompanions
  ) {
    return deprioritizeLevel;
  }

  if (!isBuffDebuff && isUtility && deprioritizeUtilityCompanions) {
    return deprioritizeLevel;
  }
  const supportDefaultPriority = (companionDetails?.priority || 6) - 4;
  const priorityLevel = supportPriority
    ? supportDefaultPriority
    : companionDetails?.priority || 0;
  console.log({
    priorityLevel,
    supportDefaultPriority,
    companionDetails,
    dpsReducePriorityLevel,
    isBuffDebuff,
    isBuff,
  });
  return Category.DPS === userType
    ? priorityLevel + dpsReducePriorityLevel
    : priorityLevel;
};

export const decompressCompanions = (
  availableCompanionList: {
    name: string;
    category: Category;
    mounts: string[];
    companions: string[];
  }[],
  {
    priorityOptions = {},
  }: {
    priorityOptions?: IpriorityCompanionOptions;
  } = {}
) => {
  return availableCompanionList.reduce(
    (prev: any[], { name, category, companions }) => {
      const companionDecompressData = companions.map((companionShortName) => {
        const companionDetails = CompanionList.find(
          ({ shortName }) => companionShortName === shortName
        );
        const usersWithCompanionCount = availableCompanionList.reduce(
          (prevCount, { name, companions: userCompanions }) => {
            return userCompanions.includes(companionShortName)
              ? prevCount + 1
              : prevCount;
          },
          0
        );
        const processedPriority = getCompanionPriorityLevel(
          companionShortName,
          {
            ...priorityOptions,
            userType: category,
            companionList: CompanionList,
            availableCompanions: availableCompanionList,
          }
        );
        return {
          shortName: companionShortName,
          userName: name,
          count: companions.length,
          usersCount: usersWithCompanionCount,
          processedPriority,
          ...companionDetails,
        };
      });

      return [...prev, ...companionDecompressData];
    },
    []
  );
};

export const sortCompanionPriority = (
  decompressedCompanions,
  { priority = ["processedPriority", "count", "usersCount"] } = {}
) => {
  return decompressedCompanions.sort(fieldSorter(priority));
};

export const groupDecompressedCompanions = (decompressedCompanions) => {
  return decompressedCompanions.reduce(
    (prev, { userName, shortName, processedPriority }) => {
      return {
        ...prev,
        [userName]: [...(prev[userName] || []), shortName],
      };
    },
    {}
  );
};

export const companionPicker = (groupedMounts) => {
  const groupEntriesList = Object.entries(groupedMounts);
  return groupEntriesList.reduce((prev, [userName, mounts], index) => {
    const exclusionList = [CompanionNames.BLACKDEATHSCORPION];
    const assignableCompanion = (mounts as string[]).find((mountName) => {
      return (
        !prev?.assignedMounts?.includes(mountName) ||
        exclusionList.includes(mountName as CompanionNames)
      );
    });
    const isLastItem = index === groupEntriesList.length - 1;
    const returnResult = {
      ...prev,
      [userName]: assignableCompanion,
      assignedMounts: [...(prev?.assignedMounts || []), assignableCompanion],
    };
    const { assignedMounts, ...userAssignedList } = returnResult;
    return isLastItem ? userAssignedList : returnResult;
  }, {} as any);
};

export const companionsSort = (
  availableCompanionsList: {
    name: string;
    category: Category;
    mounts: string[];
    artifacts: string[];
    companions: string[];
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
  const deprioritizeMitigationCompanions = !requiresMitigation[raidName];
  const priorityOptions = {
    deprioritizeMitigationCompanions,
    deprioritizeUtilityCompanions:
      raidName !== trialNamesList.GAZEMNIDS_RELIQUARY_M,
    deprioritizeStackingCompanions: true,
  };
  const decompressedCompanions = decompressCompanions(availableCompanionsList, {
    priorityOptions,
  });
  console.log({ decompressedCompanions });
  const sortResult = sortCompanionPriority(decompressedCompanions);
  console.log({ sortResult });
  const groupedCompanions = groupDecompressedCompanions(sortResult);
  console.log({ groupedCompanions });
  const picked = companionPicker(groupedCompanions);
  return picked;
};
