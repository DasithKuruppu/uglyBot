// https://autocode.com/tools/discord/command-builder/
export const info = {
  name: "info",
  description: "List some info about the bot.",
  options: [],
};

export const request_role = {
  name: "request",
  description: "Choose a type of request to make.",
  options: [
    {
      type: 1,
      name: "role",
      description: "Request a role.",
      options: [
        {
          type: 8,
          name: "name",
          description: "Choose a valid role name.",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "build",
      description: "Request a build.",
      options: [
        {
          type: 6,
          name: "user",
          description: "The name of the user you want the builds of.",
          required: true,
        },
        {
          type: 3,
          name: "type",
          description: "The type of build you want.",
          required: true,
          choices: [
            {
              name: "All",
              value: "all",
              // description: "Set type of raid to a training run",
            },
          ],
        },
      ],
    },
    {
      type: 1,
      name: "invite_link",
      description:
        "The number of people the invite link is valid for between 1 - 100.",
    },
  ],
};

export const remove_raidUser = {
  name: "remove",
  description: "remove a user from an event or raid.",
  options: [
    {
      type: 1,
      name: "raid_user",
      description: "Remove a raid user.",
      options: [
        {
          type: 6,
          name: "user",
          description: "The user you want to remove.",
          required: true,
        },
        {
          type: 3,
          name: "raid_id",
          description: "The ID of the raid you want the user removed from.",
          required: true,
        },
        {
          type: 3,
          name: "reason",
          description: "Reason for removing.",
          required: false,
          choices: [
            {
              name: "Did Not Show Up",
              value: "did not show up",
            },
            {
              name: "Were Unable To Join",
              value: "were unable to join",
            },
            {
              name: "Did Not Meet Queue Requirements",
              value: "did not meet queue requirements",
            },
            {
              name: "Ignored Mechanics",
              value: "ignored mechanics",
            },
            {
              name: "Could Not Hold Aggro",
              value: "could not hold aggro",
            },
            {
              name: "Were Wiping The Floor All Day",
              value: "were wiping the floor all day",
            },
            {
              name: "Are Too Ugly",
              value: "are too ugly",
            },
          ],
        },
      ],
    },
  ],
};

export enum trialNamesList {
  TOMM = "Tower of the Mad Mage",
  ZCM = "Zariel's Challenge (Master)",
  COKM = "Crown of Keldegonn (Master)",
  TM = "Rise of Tiamat (Master)",
  TOSM = "Temple of the Spider (Master)",
  VOS = "Vault of Stars",
  STANDARD_DUNGEON = "Standard Dungeon",
  STANDARD_TRIAL = "Standard Trial",
}

export const createRaidNameChoicesList = [
  {
    name: trialNamesList.TOMM,
    value: trialNamesList.TOMM,
    // description: "Setup a raid for TOMM",
  },
  {
    name: trialNamesList.ZCM,
    value: trialNamesList.ZCM,
    // description: "Setup a raid for ZCM",
  },
  {
    name: trialNamesList.COKM,
    value: trialNamesList.COKM,
    // description: "Setup a raid for COKM",
  },
  {
    name: trialNamesList.TM,
    value: trialNamesList.TM,
    // description: "Setup a raid for TM",
  },
  {
    name: trialNamesList.TOSM,
    value: trialNamesList.TOSM,
  },
  {
    name: trialNamesList.VOS,
    value: trialNamesList.VOS,
  },
  {
    name: trialNamesList.STANDARD_DUNGEON,
    value: trialNamesList.STANDARD_DUNGEON,
  },
  {
    name: trialNamesList.STANDARD_TRIAL,
    value: trialNamesList.STANDARD_TRIAL,
  },
];

export const create_raid = {
  name: "create",
  description: "Create a raid or event.",
  options: [
    {
      type: 1,
      name: "raid",
      description: "Set-up a raid for a trial or dungeon.",
      options: [
        {
          type: 3,
          name: "name",
          description: "Name of the trial.",
          choices: createRaidNameChoicesList,
          required: true,
        },
        {
          type: 3,
          name: "date",
          description: `ex :
          2016-03-05 23:59:59 CST , 2022-09-25T21:00:00 GMT+05:30`,
          required: true,
        },
        {
          type: 3,
          name: "type",
          description: "Set type of run.",
          required: false,
          choices: [
            {
              name: "Training",
              value: "Training",
              // description: "Training run to get the mechanics down!",
            },
            {
              name: "Farm",
              value: "Farm",
              // description: "Farming run for that delicious loot!",
            },
            {
              name: "Wipe",
              value: "Wipe",
              // description: "Wipe run just for fun with friends!",
            },
          ],
        },
        {
          type: 3,
          name: "party",
          description: "Team composition additional configurations.",
          required: false,
          choices: [
            {
              name: "Standard",
              value: "Standard",
            },
            {
              name: "Solo Tank",
              value: "Solo_tank",
            },
            {
              name: "Solo Heal",
              value: "Solo_heal",
            },
            {
              name: "Solo Tank & Solo Heal",
              value: "Solo_tank_heal",
            },
          ],
        },
        {
          type: 3,
          name: "description",
          description: "Set a description.",
          required: false,
        },
        {
          type: 5,
          name: "enable_event",
          description: "Create a Discord server event. (Default: True)",
          required: false,
        },
        {
          type: 4,
          name: "duration",
          description: "Duration for the Discord event. (Default: 2 Hours)",
          required: false,
        },
      ],
    },
    {
      type: 1,
      name: "profile",
      description: "Set-up your profile to make future sign-ups easier!",
    },
  ],
};
