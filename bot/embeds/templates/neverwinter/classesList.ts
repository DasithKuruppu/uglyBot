// using native map or other functions causes serios pulumi serialization issues so values are hardcoded atm
export const enum ClassNames {
  RANGER_DPS = "Ranger(DPS)",
  PALADIN_TANK = "Paladin(Tank)",
  PALADIN_HEAL = "Paladin(Heal)",
  BARB_TANK = "Barbarian(Tank)",
  BARB_DPS = "Barbarian(DPS)",
  ROUGE_DPS = "Rouge(DPS)",
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
  { type: string; emoji: string }
][] = [
  [
    ClassNames.RANGER_DPS,
    { type: "DPS", emoji: "<:ranger:456150278975127553>" },
  ],
  [
    ClassNames.PALADIN_TANK,
    { type: "TANK", emoji: "<:palatank:911695915637686382>" },
  ],
  [
    ClassNames.PALADIN_HEAL,
    { type: "HEAL", emoji: "<:palatank:911695915637686382>" },
  ],
  [
    ClassNames.BARB_TANK,
    { type: "TANK", emoji: "<:Ranger:922502874917904454>" },
  ],
  [ClassNames.BARB_DPS, { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  [
    ClassNames.ROUGE_DPS,
    { type: "DPS", emoji: "<:Ranger:922502874917904454>" },
  ],
  [
    ClassNames.WIZARD_DPS,
    { type: "DPS", emoji: "<:Ranger:922502874917904454>" },
  ],
  [
    ClassNames.CLERIC_HEAL,
    { type: "HEAL", emoji: "<:Ranger:922502874917904454>" },
  ],
  [
    ClassNames.CLERIC_DPS,
    { type: "DPS", emoji: "<:Ranger:922502874917904454>" },
  ],
  [ClassNames.BARB_DPS, { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  [
    ClassNames.BARD_HEAL,
    { type: "HEAL", emoji: "<:Ranger:922502874917904454>" },
  ],
  [
    ClassNames.WARLOCK_DPS,
    { type: "DPS", emoji: "<:Ranger:922502874917904454>" },
  ],
  [
    ClassNames.WARLOCK_HEAL,
    { type: "HEAL", emoji: "<:Ranger:922502874917904454>" },
  ],
  [
    ClassNames.FIGHTER_DPS,
    { type: "DPS", emoji: "<:Ranger:922502874917904454>" },
  ],
  [
    ClassNames.FIGHTER_TANK,
    { type: "TANK", emoji: "<:Ranger:922502874917904454>" },
  ],
];

export const getOptionsList = () => [
  {
    label: ClassNames.RANGER_DPS,
    value: ClassNames.RANGER_DPS,
    default: false,
  },
  {
    label: ClassNames.WIZARD_DPS,
    value: ClassNames.WIZARD_DPS,
    default: false,
  },
  {
    label: ClassNames.PALADIN_TANK,
    value: ClassNames.PALADIN_TANK,
    default: false,
  },
  {
    label: ClassNames.PALADIN_HEAL,
    value: ClassNames.PALADIN_HEAL,
    default: false,
  },
  { label: ClassNames.BARB_TANK, value: ClassNames.BARB_TANK, default: false },
  { label: ClassNames.BARB_DPS, value: ClassNames.BARB_DPS, default: false },
  { label: ClassNames.ROUGE_DPS, value: ClassNames.ROUGE_DPS, default: false },
  {
    label: ClassNames.CLERIC_HEAL,
    value: ClassNames.CLERIC_HEAL,
    default: false,
  },
  {
    label: ClassNames.CLERIC_DPS,
    value: ClassNames.CLERIC_DPS,
    default: false,
  },
  { label: ClassNames.BARB_DPS, value: ClassNames.BARB_DPS, default: false },
  { label: ClassNames.BARD_HEAL, value: ClassNames.BARD_HEAL, default: false },
  {
    label: ClassNames.WARLOCK_DPS,
    value: ClassNames.WARLOCK_DPS,
    default: false,
  },
  {
    label: ClassNames.WARLOCK_HEAL,
    value: ClassNames.WARLOCK_HEAL,
    default: false,
  },
  {
    label: ClassNames.FIGHTER_DPS,
    value: ClassNames.FIGHTER_DPS,
    default: false,
  },
  {
    label: ClassNames.FIGHTER_TANK,
    value: ClassNames.FIGHTER_TANK,
    default: false,
  },
];
