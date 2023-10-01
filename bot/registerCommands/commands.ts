// https://autocode.com/tools/discord/command-builder/

export enum previousTrialNamesList {
  TOMM = "Tower of the mad mage",
  ZCM = "Zariel's Challenge(Master)",
  COKM = "Crown of Keldegonn(Master)",
  TM = "Tiamat(Master)",
  TOSM = "Temple of Spider(Master)",
  VOS = "Vault of Stars",
  DEMO = "Demorgorgon (Master)",
  DWP = "Deamonweb Pits(Master)",
  GAZEMNIDS_RELIQUARY_M = "Gazemnid's Reliquary (Master)",
}
export enum trialNamesList {
  GAZEMNIDS_RELIQUARY_M = "Gzemnid's Reliquary (Master)",
  DWP = "Demonweb Pits(Master)",
  DWP_Advanced = "Demonweb Pits(Advanced)",
  TOMM = "Tower Of The Mad Mage",
  ZCM = "Zariel's Challenge (Master)",
  COKM = "Crown Of Keldegonn (Master)",
  TM = "Tiamat (Master)",
  TOSM = "Temple Of The Spider (Master)",
  VOS = "Vault Of Stars",
  DEMO = "Demorgorgon (Master)",
  REAPERS_CHALLENGE = "Reapers Challenge",
  STANDARD_DUNGEON = "Standard Dungeon",
  STANDARD_TRIAL = "Standard Trial",
  Dragon_hunts = "Dragon Hunts",
}

export const createRaidNameChoicesList = [
  {
    name: trialNamesList.DWP,
    value: trialNamesList.DWP,
  },
  {
    name: trialNamesList.DWP_Advanced,
    value: trialNamesList.DWP_Advanced,
  },
  {
    name: trialNamesList.GAZEMNIDS_RELIQUARY_M,
    value: trialNamesList.GAZEMNIDS_RELIQUARY_M,
  },
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
    name: trialNamesList.DEMO,
    value: trialNamesList.DEMO,
  },
  {
    name: trialNamesList.REAPERS_CHALLENGE,
    value: trialNamesList.REAPERS_CHALLENGE,
  },
  {
    name: trialNamesList.Dragon_hunts,
    value: trialNamesList.Dragon_hunts,
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

export const info = {
  name: "info",
  description: "List some info about the bot",
  options: [],
};

export const ask = {
  name: "ask",
  description: "Ask or say anything to the bot",
  options: [
    {
      type: 3,
      name: "message",
      description: "Ask something from the bot",
      required: true,
    },
  ],
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
      name: "profile",
      description: "Request profile",
      options: [
        {
          type: 6,
          name: "user",
          description: "The name of the user you want the profile of",
          required: false,
        },
      ],
    },
    {
      type: 1,
      name: "update_user_availability",
      description: "User's availability for raids",
      options: [
        {
          type: 3,
          name: "day",
          description: "The day of the week you would be available",
          required: true,
          choices: [
            {
              name: "Monday",
              value: "Monday",
            },
            {
              name: "Tuesday",
              value: "Tuesday",
            },
            {
              name: "Wednesday",
              value: "Wednesday",
            },
            {
              name: "Thursday",
              value: "Thursday",
            },
            {
              name: "Friday",
              value: "Friday",
            },
            {
              name: "Saturday",
              value: "Saturday",
            },
            {
              name: "Sunday",
              value: "Sunday",
            },
          ],
        },
        {
          type: 3,
          name: "start_time",
          description: "Start time of the day you will be available from",
          required: true,
          choices: [
            {
              name: "00:00",
              value: "00:00",
            },
            {
              name: "01:00",
              value: "01:00",
            },
            {
              name: "02:00",
              value: "02:00",
            },
            {
              name: "03:00",
              value: "03:00",
            },
            {
              name: "04:00",
              value: "04:00",
            },
            {
              name: "05:00",
              value: "05:00",
            },
            {
              name: "06:00",
              value: "06:00",
            },
            {
              name: "07:00",
              value: "07:00",
            },
            {
              name: "08:00",
              value: "08:00",
            },
            {
              name: "09:00",
              value: "09:00",
            },
            {
              name: "10:00",
              value: "10:00",
            },
            {
              name: "11:00",
              value: "11:00",
            },
            {
              name: "12:00",
              value: "12:00",
            },
            {
              name: "13:00",
              value: "13:00",
            },
            {
              name: "14:00",
              value: "14:00",
            },
            {
              name: "15:00",
              value: "15:00",
            },

            {
              name: "16:00",
              value: "16:00",
            },
            {
              name: "17:00",
              value: "17:00",
            },
            {
              name: "18:00",
              value: "18:00",
            },
            {
              name: "19:00",
              value: "19:00",
            },
            {
              name: "20:00",
              value: "20:00",
            },
            {
              name: "21:00",
              value: "21:00",
            },
            {
              name: "22:00",
              value: "22:00",
            },
            {
              name: "23:00",
              value: "23:00",
            },
          ],
        },
        {
          type: 3,
          name: "number_of_hours",
          description:
            "The number of hours you intend to play from the start time",
          required: true,
          choices: [
            {
              name: "Not Available",
              value: "0",
            },
            {
              name: "1 Hour",
              value: "1",
            },
            {
              name: "2 Hours",
              value: "2",
            },
            {
              name: "3 Hours",
              value: "3",
            },
            {
              name: "4 Hours",
              value: "4",
            },
            {
              name: "5 Hours",
              value: "5",
            },
            {
              name: "6 Hours",
              value: "6",
            },
            {
              name: "7 Hours",
              value: "7",
            },
            {
              name: "8 Hours",
              value: "8",
            },
            {
              name: "9 Hours",
              value: "9",
            },
            {
              name: "10 Hours",
              value: "10",
            },
            {
              name: "11 Hours",
              value: "11",
            },
            {
              name: "12 Hours",
              value: "12",
            },
            {
              name: "I have no life",
              value: "24",
            },
          ],
        },
      ],
    },
    {
      type: 1,
      name: "server_profile",
      description: "Request server profile",
    },
    {
      type: 1,
      name: "raid_summary",
      description: "Request summary of the upcoming raids",
    },
    {
      type: 1,
      name: "invite_link",
      description: "Get an invite link to invite users.",
    },
  ],
};

export const remove_raidUser = {
  name: "remove",
  description: "Remove a user from an event or raid.",
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
              name: "Did not show up",
              value: "did not show up",
            },
            {
              name: "Were unable to join",
              value: "were unable to join",
            },
            {
              name: "Did not meet queue requirements",
              value: "did not meet queue requirements",
            },
            {
              name: "Were wiping floor all day",
              value: "Were wiping floor all day",
            },
            {
              name: "Are too ugly",
              value: "are too ugly",
            },
            {
              name: "Could not hold aggro",
              value: "could not hold aggro",
            },
            {
              name: "Ignored mechanics",
              value: "ignored mechanics",
            },
          ],
        },
      ],
    },
  ],
};

export const create_raid = {
  name: "create",
  description: "Create a raid or event",
  options: [
    {
      type: 1,
      name: "raid",
      description: "Set-up a raid for a trial or dungeon",
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
              // description: "Set type of raid to a training run",
            },
            {
              name: "Farm",
              value: "Farm",
              // description: "Set type of raid to a farm run",
            },
            {
              name: "Wipe",
              value: "Wipe",
              // description: "Set type of raid to a wipe with a mix of experienced and inexperienced players",
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
            {
              name: "3 Heals and 2 Tanks",
              value: "Three_heal",
            },
            {
              name: "3 Heals and 1 Tank",
              value: "Three_heal_one_tank",
            },
          ],
        },
        {
          type: 3,
          name: "requirements",
          description: "Raid Requirements.",
          required: false,
          choices: [
            {
              name: "Masterworks & Power Raptors",
              value: "Masterworks,Power Raptors",
            },
            {
              name: "Masterworks",
              value: "Masterworks",
            },
            {
              name: "Wizards",
              value: "Wizards",
            },
            {
              name: "Masterworks, Power Raptors , Wizards & UHDPS 4K",
              value: "Masterworks,Power Raptors,Wizards,UHDPS 4K",
            },
          ],
        },
        {
          type: 3,
          name: "description",
          description: "Set a description.",
          required: false,
        },
        // {
        //   type: 5,
        //   name: "enable_event",
        //   description: "Create a Discord server event. (Default: True)",
        //   required: false,
        // },
        {
          type: 4,
          name: "duration",
          description: "Duration for the Discord event. (Default: 1 Hour)",
          required: false,
        },
        {
          type: 7,
          name: "voice",
          description: "The voice channel this raid takes place in",
          required: false,
        },
      ],
    },
    // {
    //   type: 1,
    //   name: "profile",
    //   description: "Set-up your profile to make future sign-ups easier!",
    // },
  ],
};
