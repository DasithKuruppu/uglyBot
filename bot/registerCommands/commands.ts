// https://autocode.com/tools/discord/command-builder/
export const info = {
  name: "info",
  description: "List some info about the bot",
  options: [],
};

export const request_role = {
  name: "request",
  description: "Choose a type of request to make",
  options: [
    {
      type: 1,
      name: "role",
      description: "request a role",
      options: [
        {
          type: 8,
          name: "name",
          description: "A valid role name",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "build",
      description: "request a build",
      options: [
        {
          type: 6,
          name: "user",
          description: "The name of the user you want the builds of",
          required: true,
        },
        {
          type: 3,
          name: "type",
          description: "The type of build you want",
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
      description: "The number of people to invite using link between 1 - 100",
    },
  ],
};

export const remove_raidUser = {
    name: "remove",
    description: "remove a user",
    options: [
      {
        type: 1,
        name: "raid_user",
        description: "remove a raid user",
        options: [
          {
            type: 6,
            name: "user",
            description: "The user you want to remove",
            required: true,
          },
          {
            type: 3,
            name: "raid_id",
            description: "The id of the raid you want the user removed from",
            required: true,
          },
          {
            type: 3,
            name: "reason",
            description: "Reason for removing",
            required: false,
            choices: [
              {
                name: "did not show up",
                value: "did not show up",
              },
              {
                name: "informed Unable to join",
                value: "informed Unable to join",
              },
              {
                name: "did not meet requirements",
                value: "did not meet requirements",
              },
              {
                name: "was wiping floor all day",
                value: "was wiping floor all day",
              },
              {
                name: "is too ugly",
                value: "is too ugly",
              },
              {
                name: "coulden't hold aggro",
                value: "coulden't hold aggro",
              },
              {
                name: "ignores mechanics",
                value: "ignores mechanics",
              },
            ],
          },
        ],
      },
    ]
  };

export enum trialNamesList {
  TOMM = "Tower of the mad mage",
  ZCM = "Zariel's Challenge(Master)",
  COKM = "Crown of Keldegonn(Master)",
  TM = "Tiamat(Master)",
  TOSM = "Temple of Spider(Master)",
  VOS = "Vault of Stars",
  STANDARD_DUNGEON = "Standard Dungeon",
  STANDARD_TRIAL = "Standard Trial"
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
  description: "create a raid or event",
  options: [
    {
      type: 1,
      name: "raid",
      description: "Setup a raid for a trial or dungeon",
      options: [
        {
          type: 3,
          name: "name",
          description: "Name of the trial",
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
          description: "Set type of run",
          required: false,
          choices: [
            {
              name: "Training run",
              value: "Training run",
              // description: "Set type of raid to a training run",
            },
            {
              name: "Farm run",
              value: "Farm run",
              // description: "Set type of raid to a farm run",
            },
            {
              name: "Wipe run",
              value: "Wipe run",
              // description: "Set type of raid to a wipe with a mix of experienced and inexperienced players",
            },
          ],
        },
        {
          type: 3,
          name: "party",
          description: "Team composition additional configurations",
          required: false,
          choices: [
            {
              name: "Standard",
              value: "Standard",
            },
            {
              name: "Solo tank",
              value: "Solo_tank",
            },
            {
              name: "Solo heal",
              value: "Solo_heal",
            },
            {
              name: "Solo tank & heal",
              value: "Solo_tank_heal",
            },
          ],
        },
        {
          type: 3,
          name: "description",
          description: "Set a description",
          required: false,
        },
        {
          type: 5,
          name: "enable_event",
          description: "Create a server event(defaults to true)",
          required: false,
        },
        {
          type: 4,
          name: "duration",
          description: "Duration for event(defaults to 2 hours)",
          required: false,
        },
      ],
    },
    {
      type: 1,
      name: "profile",
      description: "Setup your profile"
    },
  ],
};
