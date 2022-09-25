// inside a command, event listener, etc.
export const defaultRaidButtonInfo = {
  buttons: {
    joinConfirmButton: { id: `btn_join_confirmed` },
    joinWaitlistButton: { id: `btn_waitlist_join` },
    wontJoinButton: { id: `btn_wont_join` },
  },
};
export const raidBuilder = ({
  title,
  description,
  type = "",
  author = "",
  coverImageUrl = "https://pwimages-a.akamaihd.net/arc/a7/cb/a7cbd985065cee4cfa54e285dc6a948a1564178451.jpg",
  timestamp = new Date().toISOString(),
  classOptionsList,
  buttons = defaultRaidButtonInfo,
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
          options: [
            {
              label: `Demogorgons Reach`,
              value: `Demo`,
              default: false,
            },
            {
              label: `Mythallar`,
              value: `Mythallar`,
              default: false,
            },
            {
              label: `Halaster's Blast Scepture`,
              value: `Halasters`,
              default: false,
            },
            {
              label: `Wyvern - Venom Coated Knives`,
              value: `Wyvern`,
              default: false,
            },
            {
              label: `Lantern of Revelation`,
              value: `Lantern`,
              default: false,
            },
            {
              label: `Heart of Black Dragon`,
              value: `Black Dragon`,
              default: false,
            },
            {
              label: `Charm of the Serphant`,
              value: `Charm`,
              default: false,
            },
            {
              label: `Token of Chromatic`,
              value: `Token`,
              default: false,
            },
            {
              label: `Thirst`,
              value: `Thirst`,
              default: false,
            },
            {
              label: `Vanguards Banner`,
              value: `Vanguards`,
              default: false,
            },
            {
              label: `Neverwinters Standard`,
              value: `Standard`,
              default: false,
            },
            {
              label: `Sparkling Fey Emblem`,
              value: `Fey Emblem`,
              default: false,
            },
            {
              label: `Frozen Storytellers Journal`,
              value: `Frozen`,
              default: false,
            },
          ],
          min_values: 1,
          max_values: 7,
          type: 3,
        },
      ],
    },
    {
      type: 1,
      components: [
        {
          style: 3,
          label: `Join Confirmed`,
          custom_id: defaultRaidButtonInfo.buttons.joinConfirmButton.id,
          disabled: false,
          type: 2,
        },
        {
          style: 1,
          label: `Join Waitlist`,
          custom_id: defaultRaidButtonInfo.buttons.joinWaitlistButton.id,
          disabled: false,
          type: 2,
        },
        {
          style: 4,
          label: `Unable to Join`,
          custom_id: defaultRaidButtonInfo.buttons.wontJoinButton.id,
          disabled: false,
          type: 2,
        },
      ],
    },
  ],

  embeds: [
    {
      type: "rich",
      title: `${title} ${type}`,
      description: `${description}`,
      color: 0xffa200,
      // image: {
      //   url: coverImageUrl,
      //   height: 0,
      //   width: 0,
      // },
      fields: [
        {
          name: `=================== DPS ===================`,
          value: `\u200B`,
        },
        {
          name: `DPS`,
          value: `available`,
          inline: true,
        },
        {
          name: `DPS`,
          value: `available`,
          inline: true,
        },
        {
          name: `DPS`,
          value: `available`,
          inline: true,
        },
        {
          name: `DPS`,
          value: `available`,
          inline: true,
        },
        {
          name: `DPS`,
          value: `available`,
          inline: true,
        },
        {
          name: `DPS`,
          value: `available`,
          inline: true,
        },
        {
          name: `=================== Tanks ==================`,
          value: `\u200B`,
        },
        {
          name: `Tank`,
          value: `available`,
          inline: true,
        },
        {
          name: `Tank`,
          value: `available`,
          inline: true,
        },
        {
          name: `================== Healers ==================`,
          value: `\u200B`,
        },
        {
          name: `Heal`,
          value: `available`,
          inline: true,
        },
        {
          name: `Heal`,
          value: `available`,
          inline: true,
        },
        {
          name: `================== Waiting ==================`,
          value: `\u200B`,
        },
        {
          name: `waiting slot`,
          value: `available`,
          inline: true,
        },
        {
          name: `waiting slot`,
          value: `available`,
          inline: true,
        },
        {
          name: `waiting slot`,
          value: `available`,
          inline: true,
        },
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
