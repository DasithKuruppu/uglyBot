import { Category } from "../../../interactions/messageComponents/utils/categorizeEmbedFields/categorizeEmbedFields";
import { ArtifactsList } from "../artifactsList";
// inside a command, event listener, etc.
export const defaultRaidButtonInfo = {
  buttons: {
    joinConfirmButton: { id: `btn_join_confirmed` },
    joinWaitlistButton: { id: `btn_waitlist_join` },
    wontJoinButton: { id: `btn_wont_join` },
    artifactsRecomendButton: { id: `btn_artifacts_recomend`}
  },
};

export const generateAvailableFields = ({
  DPS = 6,
  TANKS = 2,
  HEALS = 2,
  WAITLIST = 3,
}) => ({
  DPS: Array(DPS).fill({
    name: `DPS`,
    value: `available`,
    inline: true,
  }),
  TANKS: Array(TANKS).fill({
    name: `Tank`,
    value: `available`,
    inline: true,
  }),
  HEALS: Array(HEALS).fill({
    name: `Heal`,
    value: `available`,
    inline: true,
  }),
  WAITLIST: Array(WAITLIST).fill({
    name: `WAITLIST`,
    value: `available`,
    inline: true,
  }),
});

export const sectionTitleNames = {
  [Category.DPS_TITLE]: `__𒆜𒆜⚔️ DPS ⚔️𒆜𒆜__`,
  [Category.TANK_TITLE]: `__𒆜𒆜🛡️ TANKS 🛡️𒆜𒆜__`,
  [Category.HEALER_TITLE]: `__𒆜𒆜⚕️ HEALS ⚕️𒆜𒆜__`,
  [Category.WAITLIST_TITLE]: `__𒆜𒆜⌛ WAITING LIST ⌛𒆜𒆜__`
}

export const raidBuilder = ({
  title,
  description,
  type = "",
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
          max_values: 1,
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
          options: ArtifactsList.map(({label,shortName})=>({label,value:shortName,default:false})),
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
          label: `Confirmed`,
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
        {
          style: 2,
          label: `Recommend Artifacts`,
          custom_id: buttons.artifactsRecomendButton.id,
          disabled: false,
          emoji: {
            id: `852657550969143306`,
            name: `pepeshy`,
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
      title: `${title}-${type}`,
      description: `${description}`,
      color: 0xffa200,
      // image: {
      //   url: coverImageUrl,
      //   height: 0,
      //   width: 0,
      // },
      fields: [
        {
          name: `__𒆜𒆜⚔️ DPS ⚔️𒆜𒆜__`,
          value: `\u200B`,
        },
        ...generateAvailableFields(template).DPS,
        {
          name: `__𒆜𒆜🛡️ TANKS 🛡️𒆜𒆜__`,
          value: `\u200B`,
        },
        ...generateAvailableFields(template).TANKS,
        {
          name: `__𒆜𒆜⚕️ HEALS ⚕️𒆜𒆜__`,
          value: `\u200B`,
        },
        ...generateAvailableFields(template).HEALS,
        {
          name: `__𒆜𒆜⌛ WAITING LIST ⌛𒆜𒆜__`,
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
