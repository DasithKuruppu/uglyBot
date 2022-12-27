export const enum ArtifactsNames {
  DEMO = "Demo",
  MYTHALLAR = "Mythallar",
  HALASTERS = "Halasters",
  WYVERN = "Wyvern",
  LANTERN = "Lantern",
  BLACK_DRAGON = "Black_Dragon",
  CHARM = "Charm",
  TOKEN = "Token",
  THIRST = "Thirst",
  VANGUARDS = "Vanguards",
  STANDARD = "Standard",
  FEY_EMBLEM = "Fey_Emblem",
  FROZEN = "Frozen",
  BLADES = "Blades",
  HORN = "Horn",
  MARK = "Mark",
  PALADIN_SIGIL = "Sigil",
  TIAMAT= "Tiamat",
  ERRATIC_DRIFT_GLOBE = "Globe",
  TYMORAS_LUCKY_COIN = "Tymora_Coin",
  ASSASSINS_DICE = "Dice",
  TENTACLE_ROD = "Tentacle_Rod"
}

export const enum ArtifactTypes {
  DEBUFF = "Debuff",
  BUFF = "Buff",
  UTILITY = "Utility",
  MITIGATION = "Mitigation",
}
export const newArtifactsList = [
  {
    label: "Demogorgon's Reach",
    shortName: ArtifactsNames.DEMO,
    priority: 1,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1060809813581377636`,
      name: `Demo`,
      animated: false,
    },
  },
  {
    label: "Assassins's Dice",
    shortName: ArtifactsNames.ASSASSINS_DICE,
    priority: 3,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1043356399587033088`,
      name: `AssassinsDice`,
      animated: false,
    },
  },
  {
    label: "Tentacle Rod",
    shortName: ArtifactsNames.TENTACLE_ROD,
    priority: 3,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1043356048356036651`,
      name: `TentacleRod`,
      animated: false,
    },
  },
  {
    label: "Mythallar Fragment",
    shortName: ArtifactsNames.MYTHALLAR,
    priority: 2,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1068867889291071538`,
      name: `Mythallar`,
      animated: false,
    },
  },
  {
    label: "Halaster's Blast Scepter",
    shortName: ArtifactsNames.HALASTERS,
    priority: 2,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1068867884673159279`,
      name: `Halasters`,
      animated: false,
    },
  },
  {
    label: "Wyvern-Venom Coated Knives",
    shortName: ArtifactsNames.WYVERN,
    priority: 4,
    type: [ArtifactTypes.DEBUFF, ArtifactTypes.MITIGATION],
    nonStackingArtifact: [ArtifactsNames.BLADES],
    emoji: {
      id: `1068867247529013268`,
      name: `Wyvern`,
      animated: false,
    },
  },
  {
    label: "Lantern of Revelation",
    shortName: ArtifactsNames.LANTERN,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1068867303996936243`,
      name: `Lantern`,
      animated: false,
    },
  },
  {
    label: "Heart of the Black Dragon",
    shortName: ArtifactsNames.BLACK_DRAGON,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1068867881611300884`,
      name: `Black_Dragon`,
      animated: false,
    },
  },
  {
    label: "Charm of the Serpent",
    shortName: ArtifactsNames.CHARM,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1068867297957134356`,
      name: `Charm`,
      animated: false,
    },
  },
  {
    label: "Token of Chromatic Storm",
    shortName: ArtifactsNames.TOKEN,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1068867288637395044`,
      name: `Token`,
      animated: false,
    },
  },
  {
    label: "Thirst",
    shortName: ArtifactsNames.THIRST,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1068867266466287656`,
      name: `Thirst`,
      animated: false,
    },
  },
  {
    label: "Vanguard's Banner",
    shortName: ArtifactsNames.VANGUARDS,
    priority: 5,
    type: [ArtifactTypes.DEBUFF, ArtifactTypes.MITIGATION],
    emoji: {
      id: `1068867261173088306`,
      name: `Vanguards`,
      animated: false,
    },
  },
  {
    label: "Neverwinter's Standard",
    shortName: ArtifactsNames.STANDARD,
    priority: 5,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1068867282471755806`,
      name: `Standard`,
      animated: false,
    },
  },
  {
    label: "Sparkling Fey Emblem",
    shortName: ArtifactsNames.FEY_EMBLEM,
    priority: 5,
    type: [ArtifactTypes.DEBUFF, ArtifactTypes.MITIGATION],
    emoji: {
      id: `1068867250976739429`,
      name: `Fey_Emblem`,
      animated: false,
    },
  },
  {
    label: "Frozen Storyteller's Journal",
    shortName: ArtifactsNames.FROZEN,
    priority: 5,
    type: [ArtifactTypes.BUFF],
    emoji: {
      id: `1068867271537201222`,
      name: `Frozen`,
      animated: false,
    },
  },
  {
    label: "Tymora's Lucky Coin",
    shortName: ArtifactsNames.TYMORAS_LUCKY_COIN,
    priority: 5,
    type: [ArtifactTypes.MITIGATION,ArtifactTypes.DEBUFF],
    emoji: {
      id: `1038015923715584060`,
      name: `Tymora_Coin`,
      animated: false,
    },
  },
  {
    label: "Erratic Drift Globe",
    shortName: ArtifactsNames.ERRATIC_DRIFT_GLOBE,
    priority: 5,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1038015915268263976`,
      name: `Globe`,
      animated: false,
    },
  },
  {
    label: "Dragonbone Blades",
    shortName: ArtifactsNames.BLADES,
    priority: 3,
    type: [ArtifactTypes.DEBUFF, ArtifactTypes.MITIGATION],
    nonStackingArtifact: [ArtifactsNames.WYVERN],
    emoji: {
      id: `1068867293381136515`,
      name: `Blades`,
      animated: false,
    },
  },
  {
    label: "Black Dragon's Mark",
    shortName: ArtifactsNames.MARK,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1068867255795982336`,
      name: `Mark`,
      animated: false,
    },
  },
  {
    label: "Horn of Valhalla",
    shortName: ArtifactsNames.HORN,
    priority: 0,
    type: [ArtifactTypes.UTILITY],
    emoji: {
      id: `1038015917386383370`,
      name: `Horn`,
      animated: false,
    },
  },
  {
    label: "Sigil of the Paladin",
    shortName: ArtifactsNames.PALADIN_SIGIL,
    priority: 1,
    type: [ArtifactTypes.MITIGATION],
    emoji: {
      id: `1038015919131205654`,
      name: `Sigil`,
      animated: false,
    },
  },
  {
    label: "Tiamat's Orb",
    shortName: ArtifactsNames.TIAMAT,
    priority: 1,
    type: [ArtifactTypes.MITIGATION],
    emoji: {
      id: `1038015921714909205`,
      name: `Tiamat`,
      animated: false,
    },
  }
];
export const ArtifactsList = [
  {
    label: "Demogorgon's Reach",
    shortName: ArtifactsNames.DEMO,
    priority: 1,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `999523830630461541`,
      name: `Demo`,
      animated: false,
    },
  },
  {
    label: "Assassins's Dice",
    shortName: ArtifactsNames.ASSASSINS_DICE,
    priority: 3,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1043356399587033088`,
      name: `AssassinsDice`,
      animated: false,
    },
  },
  {
    label: "Tentacle Rod",
    shortName: ArtifactsNames.TENTACLE_ROD,
    priority: 3,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1043356048356036651`,
      name: `TentacleRod`,
      animated: false,
    },
  },
  {
    label: "Mythallar Fragment",
    shortName: ArtifactsNames.MYTHALLAR,
    priority: 2,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `999523841544028240`,
      name: `Mythallar`,
      animated: false,
    },
  },
  {
    label: "Halaster's Blast Scepter",
    shortName: ArtifactsNames.HALASTERS,
    priority: 2,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `999523834770227270`,
      name: `Halasters`,
      animated: false,
    },
  },
  {
    label: "Wyvern-Venom Coated Knives",
    shortName: ArtifactsNames.WYVERN,
    priority: 4,
    type: [ArtifactTypes.DEBUFF, ArtifactTypes.MITIGATION],
    nonStackingArtifact: [ArtifactsNames.BLADES],
    emoji: {
      id: `999523848665972776`,
      name: `Wyvern`,
      animated: false,
    },
  },
  {
    label: "Lantern of Revelation",
    shortName: ArtifactsNames.LANTERN,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `999523840147324988`,
      name: `Lantern`,
      animated: false,
    },
  },
  {
    label: "Heart of the Black Dragon",
    shortName: ArtifactsNames.BLACK_DRAGON,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `999523836473131138`,
      name: `Black_Dragon`,
      animated: false,
    },
  },
  {
    label: "Charm of the Serpent",
    shortName: ArtifactsNames.CHARM,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `999523829133090846`,
      name: `Charm`,
      animated: false,
    },
  },
  {
    label: "Token of Chromatic Storm",
    shortName: ArtifactsNames.TOKEN,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `999523846833045597`,
      name: `Token`,
      animated: false,
    },
  },
  {
    label: "Thirst",
    shortName: ArtifactsNames.THIRST,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `999523845163712643`,
      name: `Thirst`,
      animated: false,
    },
  },
  {
    label: "Vanguard's Banner",
    shortName: ArtifactsNames.VANGUARDS,
    priority: 5,
    type: [ArtifactTypes.DEBUFF, ArtifactTypes.MITIGATION],
    emoji: {
      id: `999523825257566279`,
      name: `Vanguards`,
      animated: false,
    },
  },
  {
    label: "Neverwinter's Standard",
    shortName: ArtifactsNames.STANDARD,
    priority: 5,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `999523843276283924`,
      name: `Standard`,
      animated: false,
    },
  },
  {
    label: "Sparkling Fey Emblem",
    shortName: ArtifactsNames.FEY_EMBLEM,
    priority: 5,
    type: [ArtifactTypes.DEBUFF, ArtifactTypes.MITIGATION],
    emoji: {
      id: `999523832127819857`,
      name: `Fey_Emblem`,
      animated: false,
    },
  },
  {
    label: "Frozen Storyteller's Journal",
    shortName: ArtifactsNames.FROZEN,
    priority: 5,
    type: [ArtifactTypes.BUFF],
    emoji: {
      id: `999523833449025628`,
      name: `Frozen`,
      animated: false,
    },
  },
  {
    label: "Tymora's Lucky Coin",
    shortName: ArtifactsNames.TYMORAS_LUCKY_COIN,
    priority: 5,
    type: [ArtifactTypes.MITIGATION,ArtifactTypes.DEBUFF],
    emoji: {
      id: `1038015923715584060`,
      name: `Tymora_Coin`,
      animated: false,
    },
  },
  {
    label: "Erratic Drift Globe",
    shortName: ArtifactsNames.ERRATIC_DRIFT_GLOBE,
    priority: 5,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `1038015915268263976`,
      name: `Globe`,
      animated: false,
    },
  },
  {
    label: "Dragonbone Blades",
    shortName: ArtifactsNames.BLADES,
    priority: 3,
    type: [ArtifactTypes.DEBUFF, ArtifactTypes.MITIGATION],
    nonStackingArtifact: [ArtifactsNames.WYVERN],
    emoji: {
      id: `999523827086266368`,
      name: `Blades`,
      animated: false,
    },
  },
  {
    label: "Black Dragon's Mark",
    shortName: ArtifactsNames.MARK,
    priority: 4,
    type: [ArtifactTypes.DEBUFF],
    emoji: {
      id: `999936699423526972`,
      name: `Mark`,
      animated: false,
    },
  },
  {
    label: "Horn of Valhalla",
    shortName: ArtifactsNames.HORN,
    priority: 0,
    type: [ArtifactTypes.UTILITY],
    emoji: {
      id: `1038015917386383370`,
      name: `Horn`,
      animated: false,
    },
  },
  {
    label: "Sigil of the Paladin",
    shortName: ArtifactsNames.PALADIN_SIGIL,
    priority: 1,
    type: [ArtifactTypes.MITIGATION],
    emoji: {
      id: `1038015919131205654`,
      name: `Sigil`,
      animated: false,
    },
  },
  {
    label: "Tiamat's Orb",
    shortName: ArtifactsNames.TIAMAT,
    priority: 1,
    type: [ArtifactTypes.MITIGATION],
    emoji: {
      id: `1038015921714909205`,
      name: `Tiamat`,
      animated: false,
    },
  },
];
