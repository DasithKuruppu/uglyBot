import { convertToDiscordDate } from "../../../interactions/messageComponents/utils/date/dateToDiscordTimeStamp";

const createRaidSummary = ({
  userId,
  raidsList,
  timestamp = new Date(),
  requestedTime = Date.now(),
}) => {
  const hasRaidList = createRaidSummary?.length;
  return {
    type: "rich",
    title: `Raid summary for the upcoming week`,
    description: `${raidsList?.length} available raids for the upcoming week\n
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
    fields: raidsList.map(
      ({
        raidName,
        eventDiscordDateTime,
        type,
        createdBy,
        raidUrl,
        authorName,
      }) => {
        const relativeProcessedTime =
          Number(
            eventDiscordDateTime.substring(3, eventDiscordDateTime.length - 3)
          ) * 1000;
        const relativeProcessedTimeDiscordConvertion = convertToDiscordDate(
          new Date(relativeProcessedTime).toUTCString(),
          { relative: true }
        );
        console.log({
          relativeProcessedTime,
          relativeProcessedTimeDiscordConvertion,
          requestedTime,
        });
        return {
          name: `${raidName} [${type}]`,
          value: `[Go to raid - ${raidName}](${raidUrl})\n⏱️ ${eventDiscordDateTime}\n⌛ ${relativeProcessedTimeDiscordConvertion} \n created by <@${createdBy}>`,
          inline: false,
        };
      }
    ),
    // footer: {
    //   text: `Footer text`,
    // },
  };
};

export const raidSummaryBuilder = ({ userId, raidsList }) => {
  const serverProfileEmbed = createRaidSummary({
    userId,
    raidsList,
  });
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
            custom_id: `button_raidsummary_refresh`,
            disabled: false,
            type: 2,
          },
        ],
      },
    ],
    embeds: [serverProfileEmbed],
  };
};
