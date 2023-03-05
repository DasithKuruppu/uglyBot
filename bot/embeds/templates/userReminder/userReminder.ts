export const userReminderEmbed = ({
  title,
  description,
  timestamp = new Date(),
  image=null,
  url,
}) => {
  return {
    type: "rich",
    title,
    description,
    color: 0xffa200,
    timestamp,
    url,
    ...((image as any) && { image }),
  };
};
