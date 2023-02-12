# GETTING STARTED

Currently the bot supports the below mentioned commands.
# Commands

## info

### Description

List some info about the bot

### Options

None

## ask

### Description

Ask or say anything to the bot

### Options

- `message`: Ask something from the bot (required)

## request_role

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

## remove_raidUser

### Description

Remove a user from an event or raid.

### Options

- `raid_user`: Remove a raid user.
  - `user`: The user you want to remove. (required)
  - `raid_id`: The ID of the raid you want the user removed from. (required)
  - `reason`: Reason for removing (optional)
    - `Did not show up`: Did not show up (value: "did not show up")
    - `Were unable to join`: Were unable to join (value: "were unable to join")
    - `Did not meet queue requirements`: Did not meet queue requirements (value: "did not meet queue requirements")
    - `Were wiping floor all day`: Were wiping floor all day (value: "Were wiping floor all day")
    - `Are too ugly`: Are too ugly (value: "are too ugly")
    - `Could not hold aggro`: Could not hold aggro (value: "could not hold aggro")
    - `Ignored mechanics`: Ignored mechanics (value: "ignored mechanics")

## create_raid

### Description

Create a raid or event

### Options

- `raid`: Set-up a raid for a trial or dungeon
  - `name`: Name of the trial. (required)
    - Choice list: `createRaidNameChoicesList`
  - `date`: Date and time of the raid. ex: `2016-03-05 23:59:59 CST , 2022-09-25T21:00:00 GMT+05:30` (required)
  - `type`: Set type of run. (optional)
    - `Training`: Training (value: "Training")
    - `Farm`: Farm (value: "Farm")
