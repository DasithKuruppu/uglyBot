export const infoCardBuilder = ({}) => {
  return {
    components: [],
    embeds: [infoCard],
  };
};
const infoCard = {
  type: "rich",
  title: `Hunter Ranger-Single Target(COKM)`,
  description: `Category - DPS\nRace - Dragonborn\nParagon Path - Hunter\nTotal Item Level - 81,404\n\n☑️ Masterworks\n☑️ Raptors`,
  color: 0xffa200,
  timestamp: `2022-10-20T12:00:00.000Z`,
  image: {
    url: `https://cdn.discordapp.com/attachments/1032878743569575946/1032878784149467186/unknown.png`,
    height: 0,
    width: 0,
  },
  thumbnail: {
    url: `https://www.dasithsblog.com/images/Ranger-Hunter-Build.png`,
    height: 0,
    width: 0,
  },
  author: {
    name: `Ugly Broken Pumpkin`,
  },
  fields: [
    // {
    //   name: "__Overview__",
    //   value: "\u200B",
    //   inline: false,
    // },
    {
      name: `Encounters`,
      value: `<:Constricting_arrow:725812674142928956> <:Longstriders_shot:725813196744818699> <:Hindering_shot:725813196635504802>`,
      inline: true,
    },
    {
      name: `At-Wills`,
      value: `<:Aimed_shot:725812015297200158> <:Hunters_teamwork:725813198640644256>`,
      inline: true,
    },
    {
      name: `Daily`,
      value: `<:Slashers_mark:725813273571753990>`,
      inline: true,
    },
    {
      name: `Active Feats`,
      value: `<:Crushing_roots:725812791331782746> <:Seekers_vengeance:725813198506164255>\n`,
      inline: true,
    },
    {
      name: `Rotation`,
      value: `<:Hunters_teamwork:725813198640644256> -> <:Hindering_shot:725813196635504802> -> <:Longstriders_shot:725813196744818699> -> <:Constricting_arrow:725812674142928956> -> <:Gushing_wound:725813196509806664> -> <:Hindering_strike:725813196656738327> -> <:Steel_breeze:725813273676480583> -> <:Artifact:999523833449025628> -> <:Aimed_shot:725812015297200158> -> <:Hindering_shot:725813196635504802> -> <:Aimed_shot:725812015297200158> -> <:Longstriders_shot:725813196744818699> -> <:Constricting_arrow:725812674142928956> -> <:Toad:999577938397773894> + <:Slashers_mark:725813273571753990>\n
      
      Notes: 
      Between each Encounter/At-will/Daily x2 Tab`,
      inline: false,
    },
    { name: "\u200B", value: "Stats in combat with presence of aspect of the Pack/Ruinic Aura/Tutor", inline: false },
    {
      name: `Stats`,
      value: `Power\nAccuracy\nCombat Advantage\nCritical Strike\nCritical Serverity\nForte\nAction Point Gain\nRecharge Speed`,
      inline: true,
    },
    {
      name: `Total %`,
      value: `90\n77.7\n89.5\n86\n86.5\n56.9\n12.1\n25.8`,
      inline: true,
    },
    // {
    //   name: "__Enchantments__",
    //   value: "\u200B",
    //   inline: false,
    // },
    { name: "\u200B", value: "\u200B", inline: false },
    {
      name: `Enchantment Name`,
      value: `Jade(Offence)\nCritine(Offence)\n\nGarnet(Defence)\nAmethyst(Defence)\n\nGarnet(Utility)\n\nCursed Burn(Combat)\n\nRecharge(Bonus)\n\nDevil's Precision\nDragon Slayer`,
      inline: true,
    },
    {
      name: `Equipped Number`,
      value: `2\n2\n\n1\n3\n\n1\n\n1\n\n1\n\n1\n1`,
      inline: true,
    },
    { name: "\u200B", value: "\u200B", inline: false },
    {
      name: `Equipped Companions`,
      value: `Minsc\nBatiri\nRaptor\nStaldorf\nGolden Cat`,
      inline: false,
    },
    {
      name: `Summoned Companion`,
      value: `Festival Tiger(Augment)`,
      inline: false,
    },
    {
      name: `Companion Enhancement Slot`,
      value: `Precision(Critical Strike 7.5%)`,
      inline: false,
    },
    {
      name: `Companion Gear`,
      value: `Tarnished Emerald Talishman x 2\nThe Forest Lady's Icon x 1`,
      inline: false,
    },
    { name: "\u200B", value: "\u200B", inline: false },
    {
      name: `Mount Powers`,
      value: `Giant Toad Tounge Lash\nFerocity`,
      inline: false,
    },
    {
      name: `Mount Collars `,
      value: `Sturdy Crescent(5% Encounter Damage)\nUnified Crescent(5% Movement)\nSupportive Crescent(Stamina Gain 5%)\nWayfaring Barbed(5% Critical Serverity)\nPractical Barbed(Glory Gain)`,
      inline: false,
    },
    {
      name: `Insignia Bonus`,
      value: `Artificers Persuation x 2\nShepherd's Devotion x 1\nAssasins Covenant x 3`,
      inline: false,
    },
    {
      name: `Insignias `,
      value: `Barbed Insignia of Brutality x 1\nBarbed Insignia of Dominance x 3\nIlluminated Insignia of Dominance x 2\nBarbed Insignia of Aggression x 1\nEnlightened Insignia of Skill x 3\nEnlightened Insignia of Brutality x 1\nIlluminated Insignia of Aggression x 1\nRegal Insignia of Dominance x 3`,
      inline: false,
    },
    { name: "\u200B", value: "\u200B", inline: false },
    {
      name: "__Buffs__",
      value: "\nSquash Soup\nFlask of Potency(+1)\nSunlords",
      inline: false,
    },
  ],
  footer: {
    text: ``,
  },
};
