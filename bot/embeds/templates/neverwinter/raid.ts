import { Category } from "../../../interactions/messageComponents/utils/categorizeEmbedFields/categorizeEmbedFields";
import { ArtifactsList, newArtifactsList, ArtifactsNames } from "../artifactsList";
import { MountsList } from "../mountsList";
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
  [Category.DPS_TITLE]: `───────── <:dps:1170248887018213479> DPS <:dps:1170248887018213479> ─────────`,
  [Category.TANK_TITLE]: `──────── <:tank:1170248681635721246> TANKS <:tank:1170248681635721246> ────────`,
  [Category.HEALER_TITLE]: `──────── <:healer:1170248679563743323> HEALS <:healer:1170248679563743323> ────────`,
  [Category.WAITLIST_TITLE]: `────── ⌛ WAITING LIST ⌛ ──────`,
};

export const previousSectionTitleNames = {
  [Category.DPS_TITLE]: `───────── :dps: DPS :dps: ─────────`,
  [Category.TANK_TITLE]: `──────── :tank: TANKS :tank: ────────`,
  [Category.HEALER_TITLE]: `──────── :healer: HEALS :healer: ────────`,
  [Category.WAITLIST_TITLE]: `────── ⌛ WAITING LIST ⌛ ──────`,
};

export const requirementsEmoji = {
  None: "<:PepeHoly:934763376100384808>",
  Masterworks: "<:PepeShady:1098796907008118799>",
  "Power Raptors": "<:OK:1098445349275836550>",
  Wizards: "<:BuffClown:1098797922059026492>",
  "UHDPS 4K": "<:4k:1098797540402536498>",
};

export const raidBuilder = ({
  title,
  description,
  raidId = "defaultId",
  requirements,
  type = "",
  eventDateTime = "",
  commencedVoiceChatChannel ="",
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
          options: newArtifactsList.map(({ label, shortName, emoji }) => ({
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
          custom_id: `select_Mount`,
          placeholder: `Select Mounts`,
          options: MountsList.map(({ label, shortName, emoji }) => ({
            label,
            value: shortName,
            emoji,
            default: false,
          })),
          min_values: 1,
          max_values: 5,
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
            id: `1098445349275836550`,
            name: `OK`,
            animated: false,
          },
          custom_id: buttons.joinConfirmButton.id,
          disabled: false,
          type: 2,
        },
        {
          style: 1,
          label: `Wait`,
          custom_id: buttons.joinWaitlistButton.id,
          disabled: false,
          emoji: {
            id: `1098445352010526730`,
            name: `WaitList`,
            animated: true,
          },
          type: 2,
        },
        {
          style: 4,
          label: `Quit`,
          custom_id: buttons.wontJoinButton.id,
          disabled: false,
          emoji: {
            id: `1098444505650298950`,
            name: `RageQuit`,
            animated: true,
          },
          type: 2,
        },
        {
          style: 5,
          label: `Class Setup`,
          url: `https://uglybot.click/dashboard/classes/`,
          disabled: false,
          type: 2,
          emoji: {
            id: `934762913166663710`,
            name: `classSetup`,
            animated: false,
          },
        },
      ],
    },
  ],
  embeds: [
    {
      type: "rich",
      title: `${title} [${type}]`,
      description: `\n🆔 ${raidId}\n⏱️ ${eventDateTime}\n⌛ ${relativeEventDateTime}\n🔉 ${commencedVoiceChatChannel}\n\n **Special Requirements** ${requirements.map(
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
