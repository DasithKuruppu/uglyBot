import { convertToDiscordDate } from "../../../interactions/messageComponents/utils/date/dateToDiscordTimeStamp";

const availabilityInfo = ({
  userId,
  availabilityList,
  prefferedRaids,
  timestamp = new Date(),
  requestedTime = Date.now(),
}) => {
  return {
    type: "rich",
    title: `Raid summary for the upcoming week`,
    description: `<@${userId}}> availablility for raids\n
      Last updated - ${convertToDiscordDate("now", {
        relative: true,
      })}
      `,
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
    fields: availabilityList.map(
      ({
        availableDay,
        availableStartTime,
        availableDuration,
      }) => {
        return {
          name: `Availablility`,
          value: `${availableDay} ${availableStartTime} ${availableDuration}`,
          inline: false,
        };
      }
    ),
    // footer: {
    //   text: `Footer text`,
    // },
  };
};

export const availabilityBuilder = ({
  userName,
  userId,
  availabilityList,
  prefferedRaids = [],
}) => {
  const availabilityInfoEmbed = availabilityInfo({
    userId,
    availabilityList,
    prefferedRaids,
  });
  console.log({ prefferedRaids });
  return {
    components: [
      {
        type: 1,
        components: [
          {
            style: 3,
            label: `Refresh`,
            emoji: {
              id: `1074205923154858014`,
              name: `refresh`,
              animated: false,
            },
            custom_id: `button_raidavailability_refresh`,
            disabled: false,
            type: 2,
          },
        ],
      },
    ],
    embeds: [availabilityInfoEmbed],
  };
};
