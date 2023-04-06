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
- `profile`: Request user profile
  - `user`: The name of the user you want the profile of (optional)
- `raid_summary`: Request summary of the upcoming raids
- `invite_link`: Get an invite link to invite users.
- `server_profile`: Request server profile
- `update_user_availability`: Update your availability
  - `day`: Day of the week you will be available (required)
    - `Monday`
    - `Tuesday`
    - `Wednesday`
    - `Thursday`
    - `Friday`
    - `Saturday`
    - `Sunday`
  - `start_time`: Start time of the day you will be available from (required)
    - `00:00`
    - `01:00`
    - `02:00`
    - `03:00`
    - `04:00`
    - `05:00`
    - `06:00`
    - `07:00`
    - `08:00`
    - `09:00`
    - `10:00`
    - `11:00`
    - `12:00`
    - `13:00`
    - `14:00`
    - `15:00`
    - `16:00`
    - `17:00`
    - `18:00`
    - `19:00`
    - `20:00`
    - `21:00`
    - `22:00`
    - `23:00`
  - `number_of_hours`: The number of hours you intend to play from the start time (required)
    - `Not Available`
    - `1 Hour`
    - `2 Hours`
    - `3 Hours`
    - `4 Hours`
    - `5 Hours`
    - `6 Hours`
    - `7 Hours`
    - `8 Hours`
    - `9 Hours`
    - `10 Hours`
    - `11 Hours`
    - `12 Hours`
    - `I have no life`

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


