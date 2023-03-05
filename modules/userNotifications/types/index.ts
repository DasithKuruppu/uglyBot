import { sendDirectMessageToUser } from "./raidEventReminder";
import { remindUsersOnChannel } from "./channelReminderUser";
export enum NotificationType {
  raidEventReminder = "raidEventReminder",
  channelReminderUser = "channelReminderUser",
  userLeft = "userLeft",
}

export const notificationMapper = (
  notificationName,
  notificationData,
  serviceConfigInfo
) => {
  const mapper = {
    [NotificationType.raidEventReminder]: sendDirectMessageToUser,
    [NotificationType.channelReminderUser]: remindUsersOnChannel,
    [NotificationType.userLeft]: () => {
      console.log("userLeft");
    },
  };

  return mapper[notificationName](notificationData, serviceConfigInfo);
};
