import { dataexchange } from "@pulumi/aws";
import {
  ArtifactsList,
  ArtifactsNames,
  ArtifactTypes,
} from "../../../../embeds/templates/artifactsList";
import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import {
  availableSlotValue,
  previousAvailableSlotValue,
} from "../../../../embeds/templates/neverwinter/raid";
import { trialNamesList } from "../../../../registerCommands/commands";
import { Category } from "../categorizeEmbedFields/categorizeEmbedFields";
import { extractFieldValueAttributes } from "./embedFieldAttribute";

export const fieldSorter = (fields) => (a, b) =>
  fields
    .map((field) => {
      let order = 1;
      if (field[0] === "-") {
        order = -1;
        field = field.substring(1);
      }
      return a[field] > b[field] ? order : a[field] < b[field] ? -order : 0;
    })
    .reduce((p, n) => (p ? p : n), 0);

export const getStackingArtifacts = () =>
  ArtifactsList.reduce((prev, { shortName, nonStackingArtifact }) => {
    const foundInPrev = prev.find((stackingList) => {
      return stackingList.includes(shortName);
    });
    const isStacking =
      nonStackingArtifact && nonStackingArtifact.length >= 1 && !foundInPrev;
    return isStacking
      ? [...prev, [shortName, ...(nonStackingArtifact || [])]]
      : prev;
  }, [] as ArtifactsNames[][]);
export interface IpriorityOptions {
  artifactsList?: typeof ArtifactsList;
  userType?: Category;
  deprioritizeStackingArtifacts?: boolean;
  deprioritizeMitigationArtifacts?: boolean;
  deprioritizeUtilityArtifacts?: boolean;
  depriorotizeStackingArtifacts?: boolean;
  deprioritizeLevel?: number;
  availableArtifacts?: {
    name: string;
    category: Category;
    artifacts: string[];
  }[];
}

export const getPriorityLevel = (
  artifactShortName: string,
  {
    artifactsList = ArtifactsList,
    userType = Category.DPS,
    deprioritizeMitigationArtifacts = true,
    deprioritizeUtilityArtifacts = true,
    depriorotizeStackingArtifacts = true,
    deprioritizeLevel = 20,
    availableArtifacts = [],
  }: IpriorityOptions = {}
) => {
  const stackingArtifacts = getStackingArtifacts();
  const availableStackingArtifactsCount = stackingArtifacts.reduce(
    (prev, stackingList = []) => {
      const currentStackingListCount = stackingList.map((artifactName) => {
        return {
          artifactName,
          count: availableArtifacts.filter(({ artifacts = [] }) =>
            artifacts.includes(artifactName)
          ).length,
        };
      });
      return [...prev, currentStackingListCount.sort(fieldSorter(["-count"]))];
    },
    [] as any[]
  );

  const artifactDetails = artifactsList.find(
    ({ shortName }) => artifactShortName === shortName
  );
  const isMitigationArtifact = artifactDetails?.type.includes(
    ArtifactTypes.MITIGATION
  );
  const isUtility = artifactDetails?.type.includes(ArtifactTypes.UTILITY);
  const isDebuff = artifactDetails?.type.includes(ArtifactTypes.DEBUFF);
  const isBuff = artifactDetails?.type.includes(ArtifactTypes.BUFF);
  const isBuffDebuff = isBuff || isDebuff;
  const [firstStackingArtifact, ...otherStackingArtifacts] =
    availableStackingArtifactsCount.find((artifactsStackingCountList) =>
      artifactsStackingCountList
        .map(({ artifactName }) => artifactName)
        .includes(artifactShortName)
    ) || [];
  const otherStackingArtifactsList = otherStackingArtifacts.map(
    ({ artifactName }) => artifactName
  );
  const dpsReducePriorityLevel =
    userType === Category.DPS && isBuffDebuff ? 0 : 4;

  if (
    depriorotizeStackingArtifacts &&
    otherStackingArtifactsList.includes(artifactShortName)
  ) {
    return deprioritizeLevel;
  }

  if (
    !isBuffDebuff &&
    isMitigationArtifact &&
    deprioritizeMitigationArtifacts
  ) {
    return deprioritizeLevel;
  }

  if (
    !isBuffDebuff &&
    isUtility &&
    deprioritizeUtilityArtifacts &&
    (userType === Category.DPS || userType === Category.HEALER)
  ) {
    return deprioritizeLevel;
  }
  const priorityLevel = artifactDetails?.priority || 0;
  return Category.DPS === userType
    ? priorityLevel + dpsReducePriorityLevel
    : priorityLevel;
};

export const decompressArtifacts = (
  availableArtifactsList: {
    name: string;
    category: Category;
    artifacts: string[];
  }[],
  {
    priorityOptions = {},
  }: {
    priorityOptions?: IpriorityOptions;
  } = {}
) => {
  return availableArtifactsList.reduce(
    (prev: any[], { name, category, artifacts }) => {
      const artifactDecompressData = artifacts.map((artifactShortName) => {
        const artifactDetails = ArtifactsList.find(
          ({ shortName }) => artifactShortName === shortName
        );
        const usersWithArtifactCount = availableArtifactsList.reduce(
          (prevCount, { name, artifacts: userArtifacts }) => {
            return userArtifacts.includes(artifactShortName)
              ? prevCount + 1
              : prevCount;
          },
          0
        );
        const processedPriority = getPriorityLevel(artifactShortName, {
          ...priorityOptions,
          userType: category,
          availableArtifacts: availableArtifactsList,
        });
        return {
          artifactShortName,
          userName: name,
          artifactsCount: artifacts.length,
          usersWithArtifactCount,
          processedPriority,
          ...artifactDetails,
        };
      });

      return [...prev, ...artifactDecompressData];
    },
    []
  );
};

export const sortArtifactPriority = (
  decompressedArtifacts,
  {
    priority = [
      "artifactsCount",
      "processedPriority",
      "usersWithArtifactCount",
    ],
  } = {}
) => {
  return decompressedArtifacts.sort(fieldSorter(priority));
};

export const groupDecompressedArtifacts = (decompressedArtifacts) => {
  return decompressedArtifacts.reduce(
    (prev, { userName, artifactShortName, processedPriority }) => {
      return {
        ...prev,
        [userName]: [...(prev[userName] || []), artifactShortName],
      };
    },
    {}
  );
};

export const artifactPicker = (groupedArtifacts) => {
  const groupEntriesList = Object.entries(groupedArtifacts);
  return groupEntriesList.reduce((prev, [userName, artifacts], index) => {
    const assignableArtifact = (artifacts as string[]).find((artifactName) => {
      return !prev?.assignedArtifacts?.includes(artifactName);
    });
    const isLastItem = index === groupEntriesList.length - 1;
    const returnResult = {
      ...prev,
      [userName]: assignableArtifact,
      assignedArtifacts: [
        ...(prev?.assignedArtifacts || []),
        assignableArtifact,
      ],
    };
    const { assignedArtifacts, ...userAssignedList } = returnResult;
    return isLastItem ? userAssignedList : returnResult;
  }, {} as any);
};

export const artifactsSort = (
  availableArtifactsList: {
    name: string;
    category: Category;
    artifacts: string[];
  }[],
  raidName = "default"
) => {
  const requiresMitigation = {
    [trialNamesList.COKM]: false,
    [trialNamesList.TM]: true,
    [trialNamesList.TOMM]: true,
    [trialNamesList.ZCM]: true,
    [trialNamesList.TOSM]: false,
    default: false,
  };
  const deprioritizeMitigationArtifacts = !requiresMitigation[raidName];
  const priorityOptions = {
    deprioritizeMitigationArtifacts,
    deprioritizeUtilityArtifacts: raidName !== trialNamesList.TOMM,
    deprioritizeStackingArtifacts: true,
  };
  const decompressedArtifacts = decompressArtifacts(availableArtifactsList, {
    priorityOptions,
  });
  const sortResult = sortArtifactPriority(decompressedArtifacts);
  const groupedArtifacts = groupDecompressedArtifacts(sortResult);
  const pickedArtifacts = artifactPicker(groupedArtifacts);
  return pickedArtifacts;
};

export const createEmbedArtifactSortContent = (seperatedSections, raidName) => {
  const artifactDetails = [
    ...seperatedSections[Category.DPS],
    ...seperatedSections[Category.TANK],
    ...seperatedSections[Category.HEALER],
  ];
  const classNamesMap = new Map(NeverwinterClassesMap);
  const artifactMemberlist = artifactDetails
    .filter(({ name, value }) => {
      return ![availableSlotValue, previousAvailableSlotValue].includes(value);
    })
    .map(({ name, value }) => {
      const { memberId, userStatus, artifactsList } =
        extractFieldValueAttributes({ fieldValueText: value });

      return {
        name: memberId,
        category: (classNamesMap.get(name)?.type as Category) || Category.DPS,
        artifacts: artifactsList,
      };
    });
  const sortedArtifacts = artifactsSort(artifactMemberlist, raidName);
  const assignedArtifacts = Object.entries(sortedArtifacts)
    .map(([user, artifactName]) => {
      const emojiDetails = ArtifactsList.find(
        ({ shortName }) => artifactName === shortName
      )?.emoji;
      const emojiRender = emojiDetails
        ? `<:${emojiDetails?.name}:${emojiDetails?.id}>`
        : "❔";
      return `<@${user}> => ${emojiRender} ${artifactName}`;
    })
    .join("\n");
  return `\nAssigned/Recommended Artifacts List\n${assignedArtifacts}\n`;
};
