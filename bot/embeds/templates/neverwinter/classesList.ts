// using native map or other functions causes serios pulumi serialization issues so values are hardcoded atm
export const enum ClassNames {
  RANGER_DPS = "Ranger (DPS)",
  PALADIN_TANK = "Paladin (Tank)",
  PALADIN_HEAL = "Paladin (Heal)",
  BARB_TANK = "Barbarian (Tank)",
  BARB_DPS = "Barbarian (DPS)",
  ROUGE_DPS = "Rogue (DPS)",
  WIZARD_DPS = "Wizard (DPS)",
  CLERIC_HEAL = "Cleric (Heal)",
  CLERIC_DPS = "Cleric (DPS)",
  BARD_DPS = "Bard (DPS)",
  BARD_HEAL = "Bard (Heal)",
  WARLOCK_DPS = "Warlock (DPS)",
  WARLOCK_HEAL = "Warlock (Heal)",
  FIGHTER_DPS = "Fighter (DPS)",
  FIGHTER_TANK = "Fighter (Tank)",
}

export const NeverwinterClassesMap: [string, { type: string }][] = [
  [ClassNames.RANGER_DPS, { type: "DPS" }],
  [ClassNames.PALADIN_TANK, { type: "TANK" }],
  [ClassNames.PALADIN_HEAL, { type: "HEAL" }],
  [ClassNames.BARB_TANK, { type: "TANK" }],
  [ClassNames.BARB_DPS, { type: "DPS" }],
  [ClassNames.ROUGE_DPS, { type: "DPS" }],
  [ClassNames.WIZARD_DPS, { type: "DPS" }],
  [ClassNames.CLERIC_HEAL, { type: "HEAL" }],
  [ClassNames.CLERIC_DPS, { type: "DPS" }],
  [ClassNames.BARB_DPS, { type: "DPS" }],
  [ClassNames.BARD_HEAL, { type: "HEAL" }],
  [ClassNames.WARLOCK_DPS, { type: "DPS" }],
  [ClassNames.WARLOCK_HEAL, { type: "HEAL" }],
  [ClassNames.FIGHTER_DPS, { type: "DPS" }],
  [ClassNames.FIGHTER_TANK, { type: "TANK" }],
];

export const defaultClassName = ClassNames.RANGER_DPS;

export const getOptionsList = () => [
  {
    label: ClassNames.RANGER_DPS,
    value: ClassNames.RANGER_DPS,
    emoji: {
      id: `911695916505890837`,
      name: `Ranger`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.WIZARD_DPS,
    value: ClassNames.WIZARD_DPS,
    emoji: {
      id: `911695916409450518`,
      name: `Wizard`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.PALADIN_TANK,
    value: ClassNames.PALADIN_TANK,
    emoji: {
      id: `911695915637686382`,
      name: `Paladin_Tank`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.PALADIN_HEAL,
    value: ClassNames.PALADIN_HEAL,
    emoji: {
      id: `911695916510097458`,
      name: `Paladin_Heal`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.BARB_TANK,
    value: ClassNames.BARB_TANK,
    emoji: {
      id: `911695915528646757`,
      name: `Barb_Tank`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.BARB_DPS,
    value: ClassNames.BARB_DPS,
    emoji: {
      id: `911695916560441396`,
      name: `Barb_DPS`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.ROUGE_DPS,
    value: ClassNames.ROUGE_DPS,
    emoji: {
      id: `911695916375879720`,
      name: `Rouge_DPS`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.CLERIC_HEAL,
    value: ClassNames.CLERIC_HEAL,
    emoji: {
      id: `911695916262621245`,
      name: `Cleric_Heal`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.CLERIC_DPS,
    value: ClassNames.CLERIC_DPS,
    emoji: {
      id: `911695916585607168`,
      name: `Cleric_DPS`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.BARD_DPS,
    value: ClassNames.BARD_DPS,
    emoji: {
      id: `911695917286056007`,
      name: `Bard_DPS`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.BARD_HEAL,
    value: ClassNames.BARD_HEAL,
    emoji: {
      id: `911695915105013800`,
      name: `Bard_Heal`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.WARLOCK_DPS,
    value: ClassNames.WARLOCK_DPS,
    emoji: {
      id: `911695915901911160`,
      name: `Warlock_DPS`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.WARLOCK_HEAL,
    value: ClassNames.WARLOCK_HEAL,
    emoji: {
      id: `911695915218264085`,
      name: `Warlock_Heal`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.FIGHTER_DPS,
    value: ClassNames.FIGHTER_DPS,
    emoji: {
      id: `912085388934397982`,
      name: `Fighter_DPS`,
      animated: false,
    },
    default: false,
  },
  {
    label: ClassNames.FIGHTER_TANK,
    value: ClassNames.FIGHTER_TANK,
    emoji: {
      id: `911695916191318076`,
      name: `Fighter_Tank`,
      animated: false,
    },
    default: false,
  },
];
