import { RESTGetAPIChannelMessageResult, Routes } from "discord.js";
import { getUpcomingWeekRaids } from "../messageComponents/utils/storeOps/fetchData";
export const getAvailableUpcomingWeekRaids = async ({
  serverId,
  documentClient,
  rest,
  logger,
}) => {
  const upcomingWeekRaids = await getUpcomingWeekRaids(
    { serverId },
    {
      documentClient,
    }
  );
  logger.log("info", "Raid", { upcomingWeekRaids });

  const processedUpcomingRaids = upcomingWeekRaids
    .filter(({ title, messageId }) => title && messageId)
    .map(
      async ({
        title,
        creatorId,
        autorName,
        eventDiscordDateTime,
        isFivePerson,
        description,
        template,
        raidEmbed,
        serverId,
        messageId,
        channelId,
        type,
        updatedAt,
      }) => {
        const raidMessage = (await rest.get(
          (Routes as any).channelMessage(channelId, messageId)
        )) as RESTGetAPIChannelMessageResult;
        return {
          authorName: autorName,
          raidName: title,
          eventDiscordDateTime,
          type,
          createdBy: creatorId,
          raidMessage,
          raidUrl: `https://discord.com/channels/${serverId}/${channelId}/${messageId}`,
        };
      }
    );

  const resolvedUpcomingRaids = await Promise.allSettled(
    processedUpcomingRaids as any[]
  );

  const upcomingExisitingRecords = (
    resolvedUpcomingRaids.filter(
      ({ status }) => status === "fulfilled"
    ) as PromiseFulfilledResult<any>[]
  ).map(({ value }) => value);
  return upcomingExisitingRecords;
};
