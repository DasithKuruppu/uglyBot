// https://autocode.com/tools/discord/command-builder/
export const info = {
  name: "info",
  description: "List some info about the bot",
  options: [],
};

export const request_role = {
  name: "request",
  description: "choose a type of request to make",
  options: [
    {
      type: 8,
      name: "role",
      description: "request a role",
    },
  ],
};

export enum trialNamesList {
  TOMM = "Tower of the mad mage",
  ZCM = "Zariel's Challenge(Master)",
  COKM = "Crown of Keldegonn(Master)",
  TM = "Tiamat(Master)",
}

export const createRaidNameChoicesList = [
  {
    name: "Tower of the mad mage",
    value: "Tower of the mad mage",
    // description: "Setup a raid for TOMM",
  },
  {
    name: "Zariel's Challenge(Master)",
    value: "Zariel's Challenge(Master)",
    // description: "Setup a raid for ZCM",
  },
  {
    name: "Crown of Keldegonn(Master)",
    value: "Crown of Keldegonn(Master)",
    // description: "Setup a raid for COKM",
  },
  {
    name: "Tiamat(Master)",
    value: "Tiamat(Master)",
    // description: "Setup a raid for TM",
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
              value: "(Training run)",
              // description: "Set type of raid to a training run",
            },
            {
              name: "Farm run",
              value: "(Farm run)",
              // description: "Set type of raid to a farm run",
            },
            {
              name: "Wipe run",
              value: "(Wipe run)",
              // description: "Set type of raid to a wipe with a mix of experienced and inexperienced players",
            },
          ],
        },
        {
          type: 3,
          name: "description",
          description: "Set a description",
          required: false,
        },
      ],
    },
  ],
};
