import { displayMountsAsEmoji } from "../../../interactions/messageComponents/utils/helper/artifactsRenderer";
import { createRaidNameChoicesList } from "../../../registerCommands/commands";
import { MountsList } from "../mountsList";

const userProfile = ({
  userId,
  userName,
  userStatus,
  timeZone,
  activityList,
  prefferedRaids,
  availabilityList,
  preferredRunTypes,
  mountsList = [],
  rankList,
  classesPlayed,
  trialsParticipatedOn,
  timestamp = new Date(),
}) => {
  const hasActivityList = activityList?.length;
  const processedActivityList = activityList.reduce((prev, cur) => {
    return [...prev, cur, "\n\u200B"];
  }, []);
  return {
    type: "rich",
    title: `Profile of - ${userName}`,
    description: `\u200b`,
    color: 0xffa200,
    timestamp,
    // thumbnail: {
    //   url: `https://www.dasithsblog.com/images/Ranger-Hunter-Build.png`,
    //   height: 0,
    //   width: 0,
    // },
    // author: {
    //   name: `${author}`,
    // },
    fields: [
      {
        name: `Default Class setup and Artifacts`,
        value: classesPlayed.length ? classesPlayed.join("\n") : "-",
        inline: false,
      },
      {
        name: `Mounts`,
        value: mountsList.length
          ? displayMountsAsEmoji(mountsList).join("|")
          : "-",
        inline: false,
      },
      {
        name: `Status - ${userStatus}`,
        value: rankList.length ? rankList.join("\n") : "-",
        inline: false,
      },
      {
        name: `Recent Raid Activity List`,
        value: hasActivityList ? processedActivityList.join("\n") : "-",
        inline: false,
      },
      {
        name: `Time Zone`,
        value: timeZone ? `> ${timeZone?.label}` : "-",
        inline: false,
      },
      {
        name: "Availablity",
        value: availabilityList.length ? availabilityList
          .map(({ startTime, endTime }) => {
            return `> <t:${startTime}:F> to <t:${endTime}:t>`;
          })
          .join("\n") : `> /request update_user_availability command can be used to update your availability here`,
        inline: false,
      },
      {
        name: "Preferred Raids",
        value: prefferedRaids.length ? prefferedRaids
          .map((name) => {
            return `> ${name}`;
          })
          .join("\n"): "-",
        inline: false,
      },
      {
        name: "Preferred Raid Types",
        value: preferredRunTypes.length ? preferredRunTypes
          .map((name) => {
            return `> ${name}`;
          })
          .join("\n"): "-",
        inline: false,
      },
    ],
    // footer: {
    //   text: `Footer text`,
    // },
  };
};

export enum UserStatusValues {
  RANKI = "Monke Press W",
  RANKII = "Awkward Monke",
  RANKIII = "Boosted Monke",
  RANKIV = "Slap Monke",
  RANKV = "Monke King",
}

export const getProfileStatusesList = () => [
  {
    label: UserStatusValues.RANKV,
    emoji: {
      id: `1066215123762565151`,
      name: `MonkeyKing`,
      animated: false,
    },
    shortName: UserStatusValues.RANKV,
  },
  {
    label: UserStatusValues.RANKIV,
    emoji: {
      id: `1066225238754459659`,
      name: `MonkeySpecial`,
      animated: true,
    },
    shortName: UserStatusValues.RANKIV,
  },
  {
    label: UserStatusValues.RANKIII,
    emoji: {
      id: `806304972178063370`,
      name: `BoostedMonkey`,
      animated: true,
    },
    shortName: UserStatusValues.RANKIII,
  },
  {
    label: UserStatusValues.RANKII,
    emoji: {
      id: `881685228207374416`,
      name: `awkward_monkey_look`,
      animated: true,
    },
    shortName: UserStatusValues.RANKII,
  },
  {
    label: UserStatusValues.RANKI,
    emoji: {
      id: `1066222667180539975`,
      name: `MonkeyPressW`,
      animated: true,
    },
    shortName: UserStatusValues.RANKI,
  },
];
export const getTimeZones = () => [
  {
    label: "Central Standard Time (NA) [GMT-6]",
    value: "GMT-06:00",
  },
  {
    label: "Eastern Standard Time (NA) [GMT-5]",
    value: "GMT-05:00",
  },
  {
    label: "Pacific Standard Time (NA) [GMT-8]",
    value: "GMT-08:00",
  },
  {
    label: "Moscow Standard Time (Russia) [GMT+3]",
    value: "GMT+03:00",
  },
  {
    label: "Greenwich Mean Time (UTC) [GMT+0]",
    value: "GMT+0:00",
  },
  {
    label: "Eastern European/Central Africa/Isreal Time [GMT+2]",
    value: "GMT+02:00",
  },
  {
    label: "Central European/British/West Africa Time [GMT+1]",
    value: "GMT+01:00",
  },
  {
    label: "Australian Central Standard Time [GMT+9:30]",
    value: "GMT+9:30",
  },
  {
    label: "Brazil Time(Sao Paulo) [GMT-03:00]",
    value: "GMT-03:00",
  },
  {
    label: "Australian Eastern Standard/Hawaii Time [GMT+10:00]",
    value: "GMT+10:00",
  },
  {
    label: "Singapore Time [GMT+8:00]",
    value: "GMT+8:00",
  },
  {
    label: "Indian Standard Time [GMT+5:30]",
    value: "GMT+5:30",
  },
];
export const profileBuilder = ({
  userId,
  userName,
  prefferedRaids,
  preferredRunTypes,
  timeZone,
  activityList,
  availabilityList,
  mountsList,
  rankList,
  userStatus,
  classesPlayed,
  trialsParticipatedOn,
}) => {
  const userProfileEmbed = userProfile({
    userId,
    timeZone,
    userName,
    prefferedRaids,
    preferredRunTypes,
    activityList,
    mountsList,
    userStatus,
    availabilityList,
    rankList,
    classesPlayed,
    trialsParticipatedOn,
  });
  const profileStatuses = getProfileStatusesList();
  return {
    components: [
      {
        type: 1,
        components: [
          {
            custom_id: `select_profile_status`,
            placeholder: `Vote for a status`,
            options: profileStatuses.map(({ label, shortName, emoji }) => ({
              label,
              value: shortName,
              emoji,
              default: false,
            })),
            min_values: 1,
            type: 3,
          },
        ],
      },
      {
        type: 1,
        components: [
          {
            custom_id: `select_profile_timezone`,
            placeholder: `Select Timezone`,
            options: getTimeZones().map(({ label, value }) => ({
              label,
              value,
              default: false,
            })),
            min_values: 0,
            type: 3,
          },
        ],
      },
      {
        type: 1,
        components: [
          {
            custom_id: `select_preferred_raids`,
            placeholder: `Select Preferred Raids`,
            options: createRaidNameChoicesList.map(({ name, value }) => ({
              label: name,
              value,
              default: false,
            })),
            min_values: 0,
            max_values: 5,
            type: 3,
          },
        ],
      },
      {
        type: 1,
        components: [
          {
            custom_id: `select_preferred_raid_types`,
            placeholder: `Select Preferred Raid Types`,
            options: [
              {
                label: "Training",
                value: "Training",
                default: false,
                // description: "Set type of raid to a training run",
              },
              {
                label: "Farm",
                value: "Farm",
                default: false,
                // description: "Set type of raid to a farm run",
              },
              {
                label: "Wipe",
                value: "Wipe",
                default: false,
                // description: "Set type of raid to a wipe with a mix of experienced and inexperienced players",
              },
            ],
            min_values: 0,
            max_values: 3,
            type: 3,
          },
        ],
      },
    ],
    embeds: [userProfileEmbed],
  };
};
