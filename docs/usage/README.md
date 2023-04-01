# GETTING STARTED

Currently the bot supports the below mentioned commands.

# Commands

## /info

### Description

List some info about the bot

### Options

None

## /ask

### Description

Ask or say anything to the bot

### Options

- `message`: Ask something from the bot (required)

## /request

### Description

Choose a type of request to make.

### Options

- `role`: Request a role.
  - `name`: Choose a valid role name (required)
- `build`: Request a build.
  - `user`: The name of the user you want the builds of. (required)
  - `type`: The type of build you want. (required)
    - `All`: All (value: "all")
- `profile`: Request profile
  - `user`: The name of the user you want the profile of (optional)
- `raid_summary`: Request summary of the upcoming raids
- `invite_link`: Get an invite link to invite users.

## /remove_raidUser

### Description

Remove a user from an event or raid.

### Options

- `raid_user`: Remove a raid user.
  - `user`: The user you want to remove. (required)
  - `raid_id`: The ID of the raid you want the user removed from. (required)
  - `reason`: Reason for removing (optional)
    - `Did not show up`
    - `Were unable to join`
    - `Did not meet queue requirements`
    - `Were wiping floor all day`
    - `Are too ugly`
    - `Could not hold aggro`
    - `Ignored mechanics`

## /create_raid

### Description

Create a raid or event

### Options

- `name`: Name of the trial. (required)
  - Choice list: `createRaidNameChoicesList`
- `date`: Date and time of the raid. ex: `2016-03-05 23:59:59 CST , 2022-09-25T21:00:00 GMT+05:30` (required)
- `type`: Set type of run. (optional)
  - `Training`
  - `Farm`
  - `Wipe`
- `party`: Team composition additional configurations. (optional)
  - `Standard`
  - `Solo Tank`
  - `Solo Heal`
  - `Solo Tank & Solo Heal`
  - `3 Heals and 2 Tanks`
  - `3 Heals and 1 Tank`
- `requirements`: Raid Requirements. (optional)
  - `Masterworks & Power Raptors`
  - `Masterworks`
  - `Wizards`
  - `Masterworks, Power Raptors , Wizards & UHDPS 4K`
- `description`: Set a description. (optional)
- `duration`: Duration for the Discord event. (Default: 1 Hour) (optional)
- `voice`: The voice channel this raid takes place in (optional)

<!-- 
export const request = {
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
          description: "The number of hours you intend to play from the start time",
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
}; -->

## /request role

### Description

Request a role

### Options
- name