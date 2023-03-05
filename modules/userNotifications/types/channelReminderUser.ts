import {
  RESTGetAPIChannelMessageResult,
  RESTPostAPICurrentUserCreateDMChannelResult,
  Routes,
} from "discord.js";
import { userReminderEmbed } from "../../../bot/embeds/templates/userReminder/userReminder";
import { getRaid } from "../../../bot/interactions/messageComponents/utils/storeOps/fetchData";

export const remindUsersOnChannel = async (
  userNotification,
  { rest, documentClient, logger }
) => {
  const {
    discordMemberId,
    notificationType,
    raidTime,
    raidTitle,
    raidId,
    raidType,
    notifyTime,
    serverId,
    channelId,
    createdAt,
  } = userNotification;
  const raidInfo = await getRaid({ raidId }, { documentClient });
  const raidUrl = `https://discord.com/channels/${serverId}/${channelId}/${raidInfo.messageId}`;
  const {
    title,
    creatorId,
    autorName,
    eventDiscordDateTime,
    isFivePerson,
    description,
    template,
    raidEmbed,
    messageId,
    type,
    updatedAt,
  } = raidInfo;

  const raidMessage = (await rest.get(
    (Routes as any).channelMessage(channelId, messageId)
  )) as RESTGetAPIChannelMessageResult;
  logger.log("info", { raidMessage });
  const membersList = raidMessage.embeds?.[0].fields
    ?.filter(({ name, value }) => {
      return value.includes("@");
    })
    .map(({ name, value }) => {
      const match = value.match(/<@(\d+)>/);
      return match ? match[1] : "";
    });

  const taggedMembers = membersList
    ?.map((id) => {
      return `<@${id}>`;
    })
    .join("|");
  const userEmbedMsg = userReminderEmbed({
    title: `${raidTitle} Starting Soon!`,
    description: `Time to prepare for wipes <t:${raidTime}:R>.`,
    url: raidUrl,
    image: {
      url: "https://media.tenor.com/jHif6boX0hAAAAAC/shocked-shook.gif"
    } as any
  });

  logger.log("info", { membersList });
  return await rest.post((Routes as any).channelMessages(channelId), {
    body: {
      content: `${taggedMembers}`,
      embeds: [userEmbedMsg],
      allowed_mentions: {
        parse: ["users"],
        users: [],
      },
    },
  });
};
