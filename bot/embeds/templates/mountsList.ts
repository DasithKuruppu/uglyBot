export const enum MountNames {
  TOAD = "Toad",
  WARHORSE = "Golden_Warhorse",
  BIGSBY = "Bigsby",
  TV = "Tunnel_Vision",
  SWARM = "Swarm",
  ECLIPSE = "Eclipse",
  PEGASUS = "Pegasus",
  REX = "Rex",
  RIMFIRE = "Rimfire",
  Griffon = "Griffon"
}
export const enum MountTypes {
  DAMAGE = "Damage",
  DEBUFF = "Debuff",
  BUFF = "Buff",
  UTILITY = "Utility",
  MITIGATION = "Mitigation",
}

export const MountsList = [
  {
    label: "Tunnel Vision",
    shortName: MountNames.TV,
    priority: 3,
    type: [MountTypes.DAMAGE],
    emoji: {
      id: `1071637887197642783`,
      name: `TV`,
      animated: false,
    },
  },
  {
    label: "Toad",
    shortName: MountNames.TOAD,
    priority: 1,
    type: [MountTypes.DAMAGE],
    emoji: {
      id: `1071637944730918923`,
      name: `Toad`,
      animated: false,
    },
  },
  {
    label: "Bat Swarm",
    shortName: MountNames.SWARM,
    priority: 3,
    type: [MountTypes.DEBUFF, MountTypes.BUFF, MountTypes.MITIGATION],
    emoji: {
      id: `1071637942474379275`,
      name: `Swarm`,
      animated: false,
    },
  },
  {
    label: "Eclipse",
    shortName: MountNames.ECLIPSE,
    priority: 3,
    type: [MountTypes.DEBUFF, MountTypes.MITIGATION],
    emoji: {
      id: `1071637938942783518`,
      name: `Eclipse`,
      animated: false,
    },
  },
  {
    label: "Rex",
    shortName: MountNames.REX,
    priority: 3,
    type: [MountTypes.DEBUFF, MountTypes.BUFF],
    emoji: {
      id: `1071637891429711923`,
      name: `Rex`,
      animated: false,
    },
  },
  {
    label: "Pegasus",
    shortName: MountNames.PEGASUS,
    priority: 3,
    type: [MountTypes.DEBUFF, MountTypes.BUFF],
    emoji: {
      id: `1071712128647561236`,
      name: `Pegasus`,
      animated: false,
    },
  },
  {
    label: "Salamander",
    shortName: MountNames.RIMFIRE,
    priority: 3,
    type: [MountTypes.DEBUFF, MountTypes.BUFF],
    emoji: {
      id: `1076831970627162132`,
      name: `Rimfire_Retribution`,
      animated: false,
    },
  },
  {
    label: "Griffon",
    shortName: MountNames.Griffon,
    priority: 3,
    type: [MountTypes.DEBUFF],
    emoji: {
      id: `1076831968420970576`,
      name: `Griffon`,
      animated: false,
    },
  },
];
