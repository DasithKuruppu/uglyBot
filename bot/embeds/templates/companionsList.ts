export const enum CompanionNames {
  SPINED_DEVIL = `Spined_Devil`,
  TUTOR = `Tutor`,
  DRIZZT = `Drizzt`,
  BRUENOR = `Bruenor_Battlehammer`,
  CYCLOPS = `Cyclops_WarDrummer`,
  PORTOBELLO = `Portobello_DaVinci`,
  BLACKDEATHSCORPION = `Black_Death_Scorpion`,
}
export const enum CompanionTypes {
  DAMAGE = `Damage`,
  DEBUFF = `Debuff`,
  BUFF = `Buff`,
  UTILITY = `Utility`,
  MITIGATION = `Mitigation`,
}

export const CompanionList = [
  {
    label: `Spined Devil`,
    shortName: CompanionNames.SPINED_DEVIL,
    priority: 1,
    type: [CompanionTypes.DEBUFF],
    emoji: {
      id: `1109769146054496296`,
      name: `SpinedDevil`,
      animated: false,
    },
  },
  {
    label: `Tutor`,
    shortName: CompanionNames.TUTOR,
    priority: 1,
    type: [CompanionTypes.BUFF],
    emoji: {
      id: `1119962496997007480`,
      name: `Tutor`,
      animated: false,
    },
  },
  {
    label: `Black Death Scorpion`,
    shortName: CompanionNames.BLACKDEATHSCORPION,
    priority: 2,
    type: [CompanionTypes.UTILITY, CompanionTypes.DAMAGE],
    emoji: {
      id: `1126163203848667269`,
      name: `BlackDeathScorpion`,
      animated: false,
    },
  },
  {
    label: `Portobello DaVinci`,
    shortName: CompanionNames.PORTOBELLO,
    priority: 1,
    type: [CompanionTypes.BUFF],
    emoji: {
      id: `1125566033000939530`,
      name: `PortobelloDaVinci`,
      animated: false,
    },
  },
  {
    label: `Drizzt Do'Urden`,
    shortName: CompanionNames.DRIZZT,
    priority: 2,
    type: [CompanionTypes.BUFF],
    emoji: {
      id: `1125562971880443977`,
      name: `Drizzy`,
      animated: false,
    },
  },
  {
    label: `Bruenor Battlehammer`,
    shortName: CompanionNames.BRUENOR,
    priority: 3,
    type: [CompanionTypes.MITIGATION],
    emoji: {
      id: `1125562968688570438`,
      name: `BruenorBattlehammer`,
      animated: false,
    },
  },
  {
    label: `Cyclops War Drummer`,
    shortName: CompanionNames.CYCLOPS,
    priority: 4,
    type: [CompanionTypes.MITIGATION],
    emoji: {
      id: `1125562966742401024`,
      name: `CyclopsWarDrummer`,
      animated: false,
    },
  },
];
