import {
  ArtifactsList,
  ArtifactsNames,
  ArtifactTypes,
  newArtifactsList,
} from "../../../../embeds/templates/artifactsList";
import { MountsList } from "../../../../embeds/templates/mountsList";
import { CompanionList } from "../../../../embeds/templates/companionsList";
import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import {
  availableSlotValue,
  previousAvailableSlotValue,
} from "../../../../embeds/templates/neverwinter/raid";
import {
  previousTrialNamesList,
  trialNamesList,
} from "../../../../registerCommands/commands";
import { Category } from "../categorizeEmbedFields/categorizeEmbedFields";
import { companionPowersSort } from "./companionBonusPowerSort";
import {
  extractFieldName,
  extractFieldValueAttributes,
} from "./embedFieldAttribute";
import { mountsSort } from "./mountSorter";
import { companionsSort } from "./sortCompanions";

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
    deprioritizeLevel = 25,
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
    (userType === Category.DPS || userType === Category.HEALER || userType === Category.TANK)
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
    mounts: string[];
    artifacts: string[];
  }[],
  raidName = "default"
) => {
  const requiresMitigation = {
    [trialNamesList.Battle_of_the_Moon_Dancer_M]: false,
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

export const createEmbedArtifactSortContent = (
  seperatedSections,
  raidName,
  { memberCompanions = [] } = {}
) => {
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
      const { fieldName, optionalClasses } = extractFieldName({
        fieldNameText: name,
      });
      const { memberId, userStatus, artifactsList, mountsList } =
        extractFieldValueAttributes({ fieldValueText: value });
      const restructredMemeberCompanions = memberCompanions.map(
        ({ discordMemberId, companions }) => {
          const companionsList = companions || [];
          return [discordMemberId, companionsList];
        }
      );
      const [member, memberCompanionsList] = (restructredMemeberCompanions as any[]).find(
        ([memberDiscordId]) => memberDiscordId === memberId
      ) || [memberId, []];
      console.log({ memberCompanionsList });
      return {
        name: memberId,
        category:
          (classNamesMap.get(fieldName)?.type as Category) || Category.DPS,
        artifacts: artifactsList,
        mounts: mountsList,
        companions: memberCompanionsList || [],
      };
    });
  const sortedArtifacts = artifactsSort(artifactMemberlist, raidName);
  const sortedMounts = mountsSort(artifactMemberlist, raidName);
  const sortedCompanions = companionsSort(artifactMemberlist, raidName);
  const companionBonusPowers = companionPowersSort(artifactMemberlist);

  const assignedArtifacts = Object.entries(sortedArtifacts)
    .map(([user, artifactName]) => {
      const emojiDetails = newArtifactsList.find(
        ({ shortName }) => artifactName === shortName
      )?.emoji;
      const mountName = sortedMounts[user];
      const mountEmojiDetails = MountsList.find(
        ({ shortName }) => mountName === shortName
      )?.emoji;

      const companionName = sortedCompanions[user];
      const companionEmojiDetails = CompanionList.find(
        ({ shortName }) => companionName === shortName
      )?.emoji;

      const companionBonusPower = companionBonusPowers.find(
        ({ name, shortName, emoji }) => name === user && shortName && emoji
      );
      const emojiRender = emojiDetails
        ? `<:${emojiDetails?.name}:${emojiDetails?.id}>`
        : "❔";
      const mountEmojiRender = mountEmojiDetails
        ? `<:${mountEmojiDetails?.name}:${mountEmojiDetails?.id}> ${mountName}`
        : "❔";

      const companionEmojiRender = companionEmojiDetails
        ? `<:${companionEmojiDetails?.name}:${companionEmojiDetails?.id}> ${companionName}`
        : "❔";
      const companionBonusPowerRender = companionBonusPower
        ? `<:${companionBonusPower?.name}:${companionBonusPower?.emoji?.id}> ${companionBonusPower?.shortName}`
        : "❔";
      return [
        `<@${user}> => ${emojiRender} ${artifactName}`,
        mountEmojiRender,
        companionEmojiRender,
        companionBonusPowerRender,
      ]
        .filter((text) => text != "❔")
        .join(" |");
    })
    .join("\n");
  return `\nRecommended Artifacts/Mounts & companions\n ${assignedArtifacts}\n`;
};
