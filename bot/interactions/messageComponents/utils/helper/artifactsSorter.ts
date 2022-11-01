import {
  ArtifactsList,
  ArtifactsNames,
  ArtifactTypes,
} from "../../../../embeds/templates/artifactsList";
import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import { trialNamesList } from "../../../../registerCommands/commands";
import { Category } from "../categorizeEmbedFields/categorizeEmbedFields";
import { extractFieldValueAttributes } from "./embedFieldAttribute";

const fieldSorter = (fields) => (a, b) =>
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

export const stackingArtifacts = ArtifactsList.reduce(
  (prev, { shortName, nonStackingArtifact }) => {
    const foundInPrev = prev.find((stackingList) => {
      return stackingList.includes(shortName);
    });
    const isStacking =
      nonStackingArtifact && nonStackingArtifact.length >= 1 && !foundInPrev;
    return isStacking ? [...prev, [shortName, ...(nonStackingArtifact || [])]] : prev;
  },
  [] as ArtifactsNames[][]
).flatMap((stackingArtifactsList = []) => {
  // deprioritize all except first
  return stackingArtifactsList.slice(1);
});
export interface IpriorityOptions {
  artifactsList?: typeof ArtifactsList;
  userType?: Category;
  deprioritizeStackingArtifacts?: boolean;
  deprioritizeMitigationArtifacts?: boolean;
  deprioritizeUtilityArtifacts?: boolean;
  deprioritizeLevel?: number;
}

export const getPriorityLevel = (
  artifactShortName: string,
  {
    artifactsList = ArtifactsList,
    userType = Category.DPS,
    deprioritizeMitigationArtifacts = true,
    deprioritizeUtilityArtifacts = true,
    deprioritizeLevel = 20,
  }: IpriorityOptions = {}
) => {
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

  const dpsReducePriorityLevel =
    userType === Category.DPS && isBuffDebuff ? 0 : 4;

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
      return [
        ...prev,
        ...artifacts.map((artifactShortName) => {
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
          return {
            artifactShortName,
            userName: name,
            artifactsCount: artifacts.length,
            usersWithArtifactCount,
            processedPriority: getPriorityLevel(artifactShortName, {
              ...priorityOptions,
              userType: category,
            }),
            ...artifactDetails,
          };
        }),
      ];
    },
    []
  );
};

export const sortArtifactPriority = (
  decompressedArtifacts,
  {
    priority = [
      "artifactsCount",
      "usersWithArtifactCount",
      "processedPriority",
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

export const artifactPicker = (
  groupedArtifacts,
  { stackingArtifactsList = stackingArtifacts } = {}
) => {
  const groupEntriesList = Object.entries(groupedArtifacts);
  return groupEntriesList.reduce((prev, [userName, artifacts], index) => {
    const assignableArtifact = (artifacts as string[]).find((artifactName) => {
      const stackingArtifacts =
        stackingArtifactsList.find((list) => list.includes(artifactName)) || [];
      const stackingArtifactExists = prev?.assignedArtifacts?.find(
        (assignedArtifact) =>
          (stackingArtifacts as ArtifactsNames[]).includes(assignedArtifact)
      );
      return (
        !prev?.assignedArtifacts?.includes(artifactName) &&
        !stackingArtifactExists
      );
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
  const decompressedArtifacts = decompressArtifacts(availableArtifactsList, {
    priorityOptions: {
      deprioritizeMitigationArtifacts,
      deprioritizeUtilityArtifacts: raidName !== trialNamesList.TOMM,
      deprioritizeStackingArtifacts: true,
    },
  });
  const sortResult = sortArtifactPriority(decompressedArtifacts);
  const groupedArtifacts = groupDecompressedArtifacts(sortResult);
  const pickedArtifacts = artifactPicker(groupedArtifacts);
  return pickedArtifacts;
};


export const createEmbedArtifactSortContent = (seperatedSections)=>{
  const artifactDetails = [
    ...seperatedSections[Category.DPS],
    ...seperatedSections[Category.TANK],
    ...seperatedSections[Category.HEALER],
  ];
  const classNamesMap = new Map(NeverwinterClassesMap);
  const artifactMemberlist = artifactDetails.filter(({name,value})=>{
    return value !== 'available';
  }).map(({ name, value }) => {
    const { memberId, userStatus, artifactsList } = extractFieldValueAttributes(
      { fieldValueText: value }
    );

    return {
      name: memberId,
      category: (classNamesMap.get(name)?.type) as Category || Category.DPS,
      artifacts: artifactsList,
    };
  });
  const sortedArtifacts = artifactsSort(artifactMemberlist);
  const assignedArtifacts = Object.entries(sortedArtifacts)
    .map(([user,artifactName]) => `<@${user}> => ${artifactName}`)
    .join("\n");
  return `\n𒆜𒆜Assigned/Recommended Artifacts List𒆜𒆜\n${assignedArtifacts}\n`;
}