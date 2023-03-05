import { RESTPostAPICurrentUserCreateDMChannelResult, Routes } from "discord.js";
import { userReminderEmbed } from "../../../bot/embeds/templates/userReminder/userReminder";
import { getRaid } from "../../../bot/interactions/messageComponents/utils/storeOps/fetchData";

export const sendDirectMessageToUser = async(userNotification, {rest, documentClient, logger})=>{
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
    const epochTimeNowInSecs = Math.round(Date.now() / 1000);
    const dmChannelInfo = (await rest.post((Routes as any).userChannels(), {
      body: { recipient_id: discordMemberId },
    })) as RESTPostAPICurrentUserCreateDMChannelResult;
    logger.log("info", "dmChannelInfo", {
      dmChannelInfo,
      notifyTime,
      epochTimeNowInSecs,
      timeDiff: notifyTime - epochTimeNowInSecs
    });
    const { id } = dmChannelInfo;

    const raidInfo = await getRaid({ raidId }, { documentClient });
    const raidUrl = `https://discord.com/channels/${serverId}/${channelId}/${raidInfo.messageId}`;
    const userEmbedMsg = userReminderEmbed({
      title: `${raidTitle} Starting Soon!`,
      description: `The raid you signed up to is about to begin <t:${raidTime}:R>.\nYou can click the above link to be taken to the server's channel.`,
      url: raidUrl,
    });
    return await rest.post((Routes as any).channelMessages(id), {
      body: {
        content: "",
        embeds: [userEmbedMsg],
      },
    });
}