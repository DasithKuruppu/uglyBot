
 export const userReminderEmbed = ({
    description,
    timestamp = new Date(),
  }) => {
    return {
      type: "rich",
      title: `Hello! Just a heads up...`,
      description,
      color: 0xffa200,
      timestamp,
    };
  };
  
  
