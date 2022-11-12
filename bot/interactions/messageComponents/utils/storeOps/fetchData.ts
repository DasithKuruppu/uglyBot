import { APIInteractionGuildMember } from "discord-api-types/v10";
import { membersTable } from "../../../../../pulumi/persistantStore/tables/members";
import { raidsTable } from "../../../../../pulumi/persistantStore/tables/raids";
import { fieldSorter } from "../helper/artifactsSorter";

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

export const getRaid = async ({ raidId, creatorId }, { documentClient }) => {
  const dbResult = await documentClient
    .query({
      TableName: raidsTable.name.get(),
      KeyConditionExpression: "#DYNOBASE_raidId = :pkey",
      ExpressionAttributeValues: {
        ":pkey": raidId,
        ":creatorId": creatorId,
      },
      ExpressionAttributeNames: {
        "#DYNOBASE_raidId": "raidId",
        "#DYNOBASE_creatorId": "creatorId",
      },
      ScanIndexForward: true,
      FilterExpression: "#DYNOBASE_creatorId = :creatorId",
    })
    .promise();
  const { Items = [] } = dbResult;
  const [Item] = Items;
  return Item;
};
