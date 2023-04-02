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
  const Supports = [...Tanks, ...Healers];
  const DPS = availableUsers.filter(({ category }) =>
    [Category.DPS].includes(category)
  );

  const availableCompanionTankPowers = [
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
      label: "Slowed Reactions",
      shortName: "Slowed_Reactions",
      priority: 1,
      emoji: {
        id: `1091902793377394789`,
        name: `SlowedReactions`,
        animated: false,
      },
    },
  ];

  const assingedSupports = Supports.map(({ name }, index) => {
    const { label, shortName, emoji } = availableCompanionTankPowers[index];
    return { name, shortName, emoji, label };
  });
  const assignedDPS = DPS.map(({ name }) => {
    return { name, shortName: undefined, emoji: undefined, label: undefined };
  });

  return [...assingedSupports, ...assignedDPS];
};
