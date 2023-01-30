export const getTimeZones =()=> [
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
const getServerProfile = ({
  userId,
  serverName,
  ownerId,
  timeZone = "Eastern Standard Time (NA) [GMT-5]",
  userName,
  activityList,
  timestamp = new Date(),
}) => {
  const hasActivityList = activityList?.length;
  const processedActivityList = activityList.reduce((prev, cur) => {
    return [...prev, cur, "\n\u200B"];
  }, []);
  return {
    type: "rich",
    title: `Profile ${serverName}`,
    description: `> Owner - <@${ownerId}>\n > Time Zone : ${timeZone}\n *Only the owner can make changes to this profile* `,
    color: 0xffa200,
    timestamp,
    // thumbnail: {
    //   url: `https://www.dasithsblog.com/images/Ranger-Hunter-Build.png`,
    //   height: 0,
    //   width: 0,
    // },
    // author: {
    //   name: `${userName}`,
    // },
    fields: [
      {
        name: `Recent Activity`,
        value: hasActivityList ? processedActivityList.join("\n") : "-",
        inline: false,
      },
    ],
    // footer: {
    //   text: `Footer text`,
    // },
  };
};

export const serverProfileBuilder = ({
  userId,
  serverName,
  userName,
  timeZone,
  serverRoles,
  ownerId,
  activityList,
}) => {
  const serverProfileEmbed = getServerProfile({
    userId,
    serverName,
    timeZone,
    userName,
    ownerId,
    activityList,
  });
  return {
    components: [
      {
        type: 1,
        components: [
          {
            custom_id: `select_timezone`,
            placeholder: `Select a timezone`,
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
    ],
    embeds: [serverProfileEmbed],
  };
};
