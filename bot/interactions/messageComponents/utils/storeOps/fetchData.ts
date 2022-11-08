import { APIInteractionGuildMember } from "discord-api-types/v10";
import { membersTable } from "../../../../../pulumi/persistantStore/tables/members";
import { fieldSorter } from "../helper/artifactsSorter";

export const getLastUsersClass = async(member:APIInteractionGuildMember,{documentClient}) => {
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
