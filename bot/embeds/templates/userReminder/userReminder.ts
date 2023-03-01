
 export const userReminderEmbed = ({
    title,
    description,
    timestamp = new Date(),
    url,
  }) => {
    return {
      type: "rich",
      title,
      description,
      color: 0xffa200,
      timestamp,
      url,
    };
  };
