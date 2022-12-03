// using native map or other functions causes serios pulumi serialization issues so values are hardcoded atm
export const enum ClassNames {
  RANGER_DPS = "Ranger(DPS)",
  PALADIN_TANK = "Paladin(Tank)",
  PALADIN_HEAL = "Paladin(Heal)",
  BARB_TANK = "Barbarian(Tank)",
  BARB_DPS = "Barbarian(DPS)",
  ROUGE_DPS = "Rogue(DPS)",
  WIZARD_DPS = "Wizard(DPS)",
  CLERIC_HEAL = "Cleric(Heal)",
  CLERIC_DPS = "Cleric(DPS)",
  BARD_DPS = "Bard(DPS)",
  BARD_HEAL = "Bard(Heal)",
  WARLOCK_DPS = "Warlock(DPS)",
  WARLOCK_HEAL = "Warlock(Heal)",
  FIGHTER_DPS = "Fighter(DPS)",
  FIGHTER_TANK = "Fighter(TANK)",
}

export const NeverwinterClassesMap: [
  string,
  { type: string; label: string }
][] = [
  [ClassNames.RANGER_DPS, { type: "DPS", label: "Ranger [DPS]" }],
  [ClassNames.PALADIN_TANK, { type: "TANK", label: "Paladin [Tank]" }],
  [ClassNames.PALADIN_HEAL, { type: "HEAL", label: "Paladin [Heal]" }],
  [ClassNames.BARB_TANK, { type: "TANK", label: "Barbarian [Tank]" }],
  [ClassNames.BARB_DPS, { type: "DPS", label: "Barbarian [DPS]" }],
  [ClassNames.ROUGE_DPS, { type: "DPS", label: "Rouge [DPS]" }],
  [ClassNames.WIZARD_DPS, { type: "DPS", label: "Wizard [DPS]" }],
  [ClassNames.CLERIC_HEAL, { type: "HEAL", label: "Cleric [Heal]" }],
  [ClassNames.CLERIC_DPS, { type: "DPS", label: "Cleric [DPS]" }],
  [ClassNames.BARD_DPS, { type: "DPS", label: "Bard [DPS]" }],
  [ClassNames.BARD_HEAL, { type: "HEAL", label: "Bard [Heal]" }],
  [ClassNames.WARLOCK_DPS, { type: "DPS", label: "Warlock [DPS]" }],
  [ClassNames.WARLOCK_HEAL, { type: "HEAL", label: "Warlock [Heal]" }],
  [ClassNames.FIGHTER_DPS, { type: "DPS", label: "Fighter [DPS]" }],
  [ClassNames.FIGHTER_TANK, { type: "TANK", label: "Fighter [Tank]" }],
];

export const defaultClassName = ClassNames.RANGER_DPS;

export const getOptionsList = () => {
  const classMap = new Map(NeverwinterClassesMap);
  return ([
    {
      label: classMap.get(ClassNames.RANGER_DPS)?.label,
      value: ClassNames.RANGER_DPS,
      emoji: {
        id: `911695916505890837`,
        name: `Ranger`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.WIZARD_DPS)?.label,
      value: ClassNames.WIZARD_DPS,
      emoji: {
        id: `911695916409450518`,
        name: `Wizard`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.PALADIN_TANK)?.label,
      value: ClassNames.PALADIN_TANK,
      emoji: {
        id: `911695915637686382`,
        name: `Paladin_Tank`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.PALADIN_HEAL)?.label,
      value: ClassNames.PALADIN_HEAL,
      emoji: {
        id: `911695916510097458`,
        name: `Paladin_Heal`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.BARB_TANK)?.label,
      value: ClassNames.BARB_TANK,
      emoji: {
        id: `911695915528646757`,
        name: `Barb_Tank`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.BARB_DPS)?.label,
      value: ClassNames.BARB_DPS,
      emoji: {
        id: `911695916560441396`,
        name: `Barb_DPS`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.ROUGE_DPS)?.label,
      value: ClassNames.ROUGE_DPS,
      emoji: {
        id: `911695916375879720`,
        name: `Rouge_DPS`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.CLERIC_HEAL)?.label,
      value: ClassNames.CLERIC_HEAL,
      emoji: {
        id: `911695916262621245`,
        name: `Cleric_Heal`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.CLERIC_DPS)?.label,
      value: ClassNames.CLERIC_DPS,
      emoji: {
        id: `911695916585607168`,
        name: `Cleric_DPS`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.BARD_DPS)?.label,
      value: ClassNames.BARD_DPS,
      emoji: {
        id: `911695917286056007`,
        name: `Bard_DPS`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.BARD_HEAL)?.label,
      value: ClassNames.BARD_HEAL,
      emoji: {
        id: `911695915105013800`,
        name: `Bard_Heal`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.WARLOCK_DPS)?.label,
      value: ClassNames.WARLOCK_DPS,
      emoji: {
        id: `911695915901911160`,
        name: `Warlock_DPS`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.WARLOCK_HEAL)?.label,
      value: ClassNames.WARLOCK_HEAL,
      emoji: {
        id: `911695915218264085`,
        name: `Warlock_Heal`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.FIGHTER_DPS)?.label,
      value: ClassNames.FIGHTER_DPS,
      emoji: {
        id: `912085388934397982`,
        name: `Fighter_DPS`,
        animated: false,
      },
      default: false,
    },
    {
      label: classMap.get(ClassNames.FIGHTER_TANK)?.label,
      value: ClassNames.FIGHTER_TANK,
      emoji: {
        id: `911695916191318076`,
        name: `Fighter_Tank`,
        animated: false,
      },
      default: false,
    },
  ]);
};
