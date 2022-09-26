// using native map or other functions causes serios pulumi serialization issues so values are hardcoded atm
export const NeverwinterClassesMap: [
  string,
  { type: string; emoji: string }
][] = [
  ["Ranger", { type: "DPS", emoji: "<:ranger:456150278975127553>" }],
  ["Paladin(Tank)", { type: "TANK", emoji: "<:palatank:911695915637686382>" }],
  ["Paladin(Heal)", { type: "HEAL", emoji: "<:palatank:911695915637686382>" }],
  ["Barbarian(Tank)", { type: "TANK", emoji: "<:Ranger:922502874917904454>" }],
  ["Barbarian(DPS)", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Rouge", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Wizard(Thaumaturge)", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Wizard(Arcanist)", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Cleric(Heal)", { type: "HEAL", emoji: "<:Ranger:922502874917904454>" }],
  ["Cleric(DPS)", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Bard", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Bard(Heal)", { type: "HEAL", emoji: "<:Ranger:922502874917904454>" }],
  ["Warlock", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Warlock(Heal)", { type: "HEAL", emoji: "<:Ranger:922502874917904454>" }],
  ["Fighter", { type: "DPS", emoji: "<:Ranger:922502874917904454>" }],
  ["Fighter(Tank)", { type: "TANK", emoji: "<:Ranger:922502874917904454>" }],
];

export const getOptionsList = () => [
  { label: "Ranger", value: "Ranger", default: false },
  { label: "Wizard(Thaumaturge)", value: "Wizard(Thaumaturge)", default: false },
  { label: "Wizard(Arcanist)", value: "Wizard(Arcanist)", default: false },
  { label: "Paladin(Tank)", value: "Paladin(Tank)", default: false },
  { label: "Paladin(Heal)", value: "Paladin(Heal)", default: false },
  { label: "Barbarian(Tank)", value: "Barbarian(Tank)", default: false },
  { label: "Barbarian(DPS)", value: "Barbarian(DPS)", default: false },
  { label: "Rouge", value: "Rouge", default: false },
  { label: "Cleric(Heal)", value: "Cleric(Heal)", default: false },
  { label: "Cleric(DPS)", value: "Cleric(DPS)", default: false },
  { label: "Bard", value: "Bard", default: false },
  { label: "Bard(Heal)", value: "Bard(Heal)", default: false },
  { label: "Warlock", value: "Warlock", default: false },
  { label: "Warlock(Heal)", value: "Warlock(Heal)", default: false },
  { label: "Fighter", value: "Fighter", default: false },
  { label: "Fighter(Tank)", value: "Fighter(Tank)", default: false },
];
