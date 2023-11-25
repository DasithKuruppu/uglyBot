import { trialNamesList } from "../../../../registerCommands/commands";
import { Category } from "../categorizeEmbedFields/categorizeEmbedFields";

export const companionPowersSort = (
  availableUsers: {
    name: string;
    category: Category;
    mounts: string[];
    artifacts: string[];
  }[],
  raidName = "default"
) => {
  const Tanks = availableUsers.filter(({ category }) =>
    [Category.TANK].includes(category)
  );
  const Healers = availableUsers.filter(({ category }) =>
    [Category.HEALER].includes(category)
  );
  const DPS = availableUsers.filter(({ category }) =>
    [Category.DPS].includes(category)
  );
  const availableCompanionHealPowers = [
    {
      label: "Slowed Reactions",
      shortName: "Slowed_Reactions",
      priority: 1,
      emoji: {
        id: `1091902793377394789`,
        name: `SlowedReactions`,
        animated: false,
      },
    },
    {
      label: "Vulnerability",
      shortName: "Vulnerability",
      priority: 1,
      emoji: {
        id: `1091902790000988170`,
        name: `Vulnerability`,
        animated: false,
      },
    },
    {
      label: "Personal",
      shortName: "Personal",
      priority: 1,
      emoji: {
        id: `1162793563076182086`,
        name: `Personal`,
        animated: false,
      },
    },
  ];

  const availableCompanionTankPowers = [
    {
      label: "Weapon Break",
      shortName: "Weapon_Break",
      priority: 1,
      emoji: {
        id: `1162737401702125698`,
        name: `WeaponBreak`,
        animated: false,
      },
    },
    {
      label: "Weapon Break",
      shortName: "Weapon_Break",
      priority: 1,
      emoji: {
        id: `1162737401702125698`,
        name: `WeaponBreak`,
        animated: false,
      },
    },
  ];

  // create a seperate list for dps without weapon break and slowed reactions
  // if raid is GAZEMNIDS_RELIQUARY_M or TM
  const availableCompanionDpsPowerList = [
    {
      label: "Armour Break",
      shortName: "Armour_Break",
      priority: 1,
      emoji: {
        id: `1091902795529072750`,
        name: `ArmourBreak`,
        animated: false,
      },
    },
    {
      label: "Dulled Senses",
      shortName: "Dulled_Senses",
      priority: 1,
      emoji: {
        id: `1091902798792245370`,
        name: `DulledSenses`,
        animated: false,
      },
    },
    {
      label: "Vulnerability",
      shortName: "Vulnerability",
      priority: 1,
      emoji: {
        id: `1091902790000988170`,
        name: `Vulnerability`,
        animated: false,
      },
    },
    {
      label: "Armour Break",
      shortName: "Armour_Break",
      priority: 1,
      emoji: {
        id: `1091902795529072750`,
        name: `ArmourBreak`,
        animated: false,
      },
    },
    {
      label: "Dulled Senses",
      shortName: "Dulled_Senses",
      priority: 1,
      emoji: {
        id: `1091902798792245370`,
        name: `DulledSenses`,
        animated: false,
      },
    },
    {
      label: "Personal",
      shortName: "Personal",
      priority: 1,
      emoji: {
        id: `1162793563076182086`,
        name: `Personal`,
        animated: false,
      },
    },
    {
      label: "Personal",
      shortName: "Personal",
      priority: 1,
      emoji: {
        id: `1162793563076182086`,
        name: `Personal`,
        animated: false,
      },
    },
    {
      label: "Personal",
      shortName: "Personal",
      priority: 1,
      emoji: {
        id: `1162793563076182086`,
        name: `Personal`,
        animated: false,
      },
    },
    {
      label: "Personal",
      shortName: "Personal",
      priority: 1,
      emoji: {
        id: `1162793563076182086`,
        name: `Personal`,
        animated: false,
      },
    },
    {
      label: "Personal",
      shortName: "Personal",
      priority: 1,
      emoji: {
        id: `1162793563076182086`,
        name: `Personal`,
        animated: false,
      },
    },
  ];

  // if (
  //   [trialNamesList.GAZEMNIDS_RELIQUARY_M, trialNamesList.TM].includes(
  //     raidName as trialNamesList
  //   )
  // ) {
  // }

  const assingedTanks = Tanks.map(({ name }, index) => {
    const { label, shortName, emoji } =
      availableCompanionTankPowers[index] || {};
    return { name, shortName, emoji, label };
  });
  const assignedHealers = Healers.map(({ name }, index) => {
    const { label, shortName, emoji } =
      availableCompanionHealPowers[index] || {};
    return { name, shortName, emoji, label };
  });

  const assignedDPS = DPS.map(({ name }, index) => {
    const { label, shortName, emoji } =
      availableCompanionDpsPowerList[index] || {};
    return { name, shortName, emoji, label };
  });

  return [...assingedTanks, ...assignedHealers, ...assignedDPS];
};
