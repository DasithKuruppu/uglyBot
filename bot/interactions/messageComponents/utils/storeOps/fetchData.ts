import { APIInteractionGuildMember } from "discord-api-types/v10";
import { membersTable } from "../../../../../pulumi/persistantStore/tables/members";
import { raidsTable } from "../../../../../pulumi/persistantStore/tables/raids";
import { fieldSorter } from "../helper/artifactsSorter";

export const getUserByClass = async (
  member: APIInteractionGuildMember,
  requestedClass: string,
  { documentClient }
) => {
  const { Item = {} } = await documentClient
    .get({
      TableName: membersTable.name.get(),
      Key: {
        discordMemberId: member.user.id,
        className: requestedClass,
      },
    })
    .promise();
  return Item;
};
export const getLastUsersClass = async (
  member: APIInteractionGuildMember,
  { documentClient }
) => {
  const dbResult = await documentClient
    .query({
      TableName: membersTable.name.get(),
      KeyConditionExpression: "#DYNOBASE_discordMemberId = :pkey",
      ExpressionAttributeValues: {
        ":pkey": member?.user?.id,
      },
      ExpressionAttributeNames: {
        "#DYNOBASE_discordMemberId": "discordMemberId",
      },
      ScanIndexForward: true,
    })
    .promise();
  const { Items = [] } = dbResult;
  const [Item] = Items.sort(fieldSorter(["-updatedAt", "-createdAt"]));
  return Item;
};

export const getRaid = async (
  { raidId, creatorId }: { raidId: string; creatorId?: string },
  { documentClient }
) => {
  const dbResult = await documentClient
    .query({
      TableName: raidsTable.name.get(),
      KeyConditionExpression: "#DYNOBASE_raidId = :pkey",
      ExpressionAttributeValues: {
        ":pkey": raidId,
        ...(creatorId && { ":creatorId": creatorId }),
      },
      ExpressionAttributeNames: {
        "#DYNOBASE_raidId": "raidId",
        ...(creatorId && { "#DYNOBASE_creatorId": "creatorId" }),
      },
      ScanIndexForward: true,
      ...(creatorId && {
        FilterExpression: "#DYNOBASE_creatorId = :creatorId",
      }),
    })
    .promise();
  const { Items = [] } = dbResult;
  const [Item] = Items;
  return Item;
};

export const getUpcomingWeekRaids = async (
  { serverId, today = Date.now() }: { serverId: string; today?: number },
  { documentClient }
) => {
  const currentDay = new Date(today);
  const weekAhead = currentDay.setDate(currentDay.getDate() + 7);
  const dbResult = await documentClient
    .query({
      TableName: raidsTable.name.get(),
      IndexName: "eventTimeIndex",
      KeyConditionExpression: "#serverId = :pkey AND #eventDiscordDateTime BETWEEN :today AND :weekAhead",
      ExpressionAttributeValues: {
        ":pkey": serverId,
        ":weekAhead": `<t:${weekAhead}:F>`,
        ":today": `<t:${today}:F>`,
      },
      ExpressionAttributeNames: {
        "#serverId": "serverId",
        "#eventDiscordDateTime": "eventDiscordDateTime",
      },
      ScanIndexForward: true,
      Limit: 10,
    })
    .promise();
  const { Items = [] } = dbResult;
  return Items;
};
