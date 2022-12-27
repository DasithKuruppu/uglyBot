const userProfile = ({
  userId,
  userName,
  userStatus,
  activityList,
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
        name: `Status - ${userStatus}`,
        value: rankList.length ? rankList.join("\n") : "-",
        inline: false,
      },
      {
        name: `Recent Raid Activity List`,
        value: hasActivityList ? processedActivityList.join("\n") : "-",
        inline: false,
      },
    ],
    // footer: {
    //   text: `Footer text`,
    // },
  };
};

export enum UserStatusValues {
  RANKI = "Monki Press W",
  RANKII = "Awkward Monki",
  RANKIII = "Boosted Monki",
  RANKIV = "Slap Monki",
  RANKV = "Monki King",
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
export const profileBuilder = ({
  userId,
  userName,
  activityList,
  rankList,
  userStatus,
  classesPlayed,
  trialsParticipatedOn,
}) => {
  const userProfileEmbed = userProfile({
    userId,
    userName,
    activityList,
    userStatus,
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
    ],
    embeds: [userProfileEmbed],
  };
};
