import { Category } from "../../../interactions/messageComponents/utils/categorizeEmbedFields/categorizeEmbedFields";
import { ArtifactsList, ArtifactsNames } from "../artifactsList";
// inside a command, event listener, etc.
export const defaultRaidButtonInfo = {
  buttons: {
    joinConfirmButton: { id: `btn_join_confirmed` },
    joinWaitlistButton: { id: `btn_waitlist_join` },
    wontJoinButton: { id: `btn_wont_join` },
  },
};

export const availableSlotValue = "-";
export const previousAvailableSlotValue = "available";

export const generateAvailableFields = ({
  DPS = 6,
  TANKS = 2,
  HEALS = 2,
  WAITLIST = 3,
}) => ({
  DPS: Array(DPS).fill({
    name: `DPS`,
    value: availableSlotValue,
    inline: true,
  }),
  TANKS: Array(TANKS).fill({
    name: `Tank`,
    value: availableSlotValue,
    inline: true,
  }),
  HEALS: Array(HEALS).fill({
    name: `Heal`,
    value: availableSlotValue,
    inline: true,
  }),
  WAITLIST: Array(WAITLIST).fill({
    name: `WAITLIST`,
    value: availableSlotValue,
    inline: true,
  }),
});

export const sectionTitleNames = {
  [Category.DPS_TITLE]: `───────── <:dps:911695908482207774> DPS <:dps:911695908482207774> ─────────`,
  [Category.TANK_TITLE]: `──────── <:tank:911695908134060112> TANKS <:tank:911695908134060112> ────────`,
  [Category.HEALER_TITLE]: `──────── <:healer:911695908117315654> HEALS <:healer:911695908117315654> ────────`,
  [Category.WAITLIST_TITLE]: `────── ⌛ WAITING LIST ⌛ ──────`,
};

export const previousSectionTitleNames = {
  [Category.DPS_TITLE]: `───────── :dps: DPS :dps: ─────────`,
  [Category.TANK_TITLE]: `──────── :tank: TANKS :tank: ────────`,
  [Category.HEALER_TITLE]: `──────── :healer: HEALS :healer: ────────`,
  [Category.WAITLIST_TITLE]: `────── ⌛ WAITING LIST ⌛ ──────`,
};

export const requirementsEmoji = {
  None: "<:peepocross:939211954361356298>",
  Masterworks: "<:pepebusiness:980874947608064030>",
  "Power Raptors": "<:pepeOK:739862110414045246>",
  Wizards: "<:PES_BuffClown:645569565824122880>",
  "UHDPS 4K": "<:4k:1027984774452748289>",
};

export const raidBuilder = ({
  title,
  description,
  raidId = "defaultId",
  requirements,
  type = "",
  eventDateTime = "",
  relativeEventDateTime = "",
  author = "",
  coverImageUrl = "https://pwimages-a.akamaihd.net/arc/a7/cb/a7cbd985065cee4cfa54e285dc6a948a1564178451.jpg",
  timestamp = new Date().toISOString(),
  classOptionsList,
  buttons = defaultRaidButtonInfo.buttons,
  template = {
    DPS: 6,
    TANKS: 2,
    HEALS: 2,
    WAITLIST: 3,
  },
}) => ({
  components: [
    {
      type: 1,
      components: [
        {
          custom_id: `select_Class`,
          placeholder: `Select Class`,
          options: classOptionsList || [],
          min_values: 1,
          max_values: 3,
          type: 3,
        },
      ],
    },
    {
      type: 1,
      components: [
        {
          custom_id: `select_Artifact`,
          placeholder: `Select Artifacts`,
          options: ArtifactsList.map(({ label, shortName, emoji }) => ({
            label,
            value: shortName,
            emoji,
            default: false,
          })),
          min_values: 1,
          max_values: 10,
          type: 3,
        },
      ],
    },
    {
      type: 1,
      components: [
        {
          style: 3,
          label: `Join`,
          emoji: {
            id: `751348432093970443`,
            name: `yes`,
            animated: true,
          },
          custom_id: buttons.joinConfirmButton.id,
          disabled: false,
          type: 2,
        },
        {
          style: 1,
          label: `Join Waitlist`,
          custom_id: buttons.joinWaitlistButton.id,
          disabled: false,
          emoji: {
            id: `751351078477627402`,
            name: `pepeT`,
            animated: false,
          },
          type: 2,
        },
        {
          style: 4,
          label: `Rage quit`,
          custom_id: buttons.wontJoinButton.id,
          disabled: false,
          emoji: {
            id: `513349083415576611`,
            name: `aPES_Leave`,
            animated: true,
          },
          type: 2,
        },
      ],
    },
  ],
  embeds: [
    {
      type: "rich",
      title: `${title} [${type}]`,
      description: `\n🆔 ${raidId}\n⏱️ ${eventDateTime}\n⌛ ${relativeEventDateTime}\n\n **Special Requirements** ${requirements.map(
        (value) => {
          return `\n ${requirementsEmoji[value] || "✅"}  ${value}`;
        }
      ).join("")} \n${description}\n`,
      color: 0xffa200,
      // image: {
      //   url: coverImageUrl,
      //   height: 0,
      //   width: 0,
      // },
      fields: [
        {
          name: sectionTitleNames[Category.DPS_TITLE],
          value: `\u200B`,
        },
        ...generateAvailableFields(template).DPS,
        {
          name: sectionTitleNames[Category.TANK_TITLE],
          value: `\u200B`,
        },
        ...generateAvailableFields(template).TANKS,
        {
          name: sectionTitleNames[Category.HEALER_TITLE],
          value: `\u200B`,
        },
        ...generateAvailableFields(template).HEALS,
        {
          name: sectionTitleNames[Category.WAITLIST_TITLE],
          value: `\u200B`,
        },
        ...generateAvailableFields(template).WAITLIST,
      ],
      timestamp: `${timestamp}`,
      thumbnail: {
        url: coverImageUrl,
        height: 0,
        width: 0,
      },
      footer: {
        text: `Created by - ${author}`,
      },
    },
  ],
});
