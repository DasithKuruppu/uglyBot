// using native map or other functions causes serios pulumi serialization issues so values are hardcoded atm
export const NeverwinterClassesMap: [
  string,
  { type: string; emoji: string }
][] = [
  ["Ranger(DPS)", { type: "DPS", emoji: "<:ranger:456150278975127553>" }],
  ["Paladin(Tank)", { type: "TANK", emoji: "<:palatank:911695915637686382>" }],
  ["Paladin(Heal)", { type: "HEAL", emoji: "<:palatank:911695915637686382>" }],
  ["Barbarian(Tank)", { type: "TANK", emoji: "<:Ranger:922502874917904454>" }],
  ["Barbarian(DPS)", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Rouge(DPS)", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Wizard(DPS)", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Cleric(Heal)", { type: "HEAL", emoji: "<:Ranger:922502874917904454>" }],
  ["Cleric(DPS)", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Bard(DPS)", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Bard(Heal)", { type: "HEAL", emoji: "<:Ranger:922502874917904454>" }],
  ["Warlock(DPS)", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Warlock(Heal)", { type: "HEAL", emoji: "<:Ranger:922502874917904454>" }],
  ["Fighter(DPS)", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Fighter(Tank)", { type: "TANK", emoji: "<:Ranger:922502874917904454>" }],
];

export const getOptionsList = () => [
  { label: "Ranger(DPS)", value: "Ranger(DPS)", default: false },
  { label: "Wizard(DPS)", value: "Wizard(DPS)", default: false },
  { label: "Paladin(Tank)", value: "Paladin(Tank)", default: false },
  { label: "Paladin(Heal)", value: "Paladin(Heal)", default: false },
  { label: "Barbarian(Tank)", value: "Barbarian(Tank)", default: false },
  { label: "Barbarian(DPS)", value: "Barbarian(DPS)", default: false },
  { label: "Rouge(DPS)", value: "Rouge(DPS)", default: false },
  { label: "Cleric(Heal)", value: "Cleric(Heal)", default: false },
  { label: "Cleric(DPS)", value: "Cleric(DPS)", default: false },
  { label: "Bard(DPS)", value: "Bard(DPS)", default: false },
  { label: "Bard(Heal)", value: "Bard(Heal)", default: false },
  { label: "Warlock(DPS)", value: "Warlock(DPS)", default: false },
  { label: "Warlock(Heal)", value: "Warlock(Heal)", default: false },
  { label: "Fighter(DPS)", value: "Fighter(DPS)", default: false },
  { label: "Fighter(Tank)", value: "Fighter(Tank)", default: false },
];
