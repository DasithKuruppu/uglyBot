
 export const userReminderEmbed = ({
    description,
    timestamp = new Date(),
  }) => {
    return {
      type: "rich",
      title: `Heloo ! , hope you didnt forget...`,
      description,
      color: 0xffa200,
      timestamp,
    };
  };
  
  