import { APIInteractionGuildMember } from "discord.js";
import { serverProfileTable } from "../../../../../pulumi/persistantStore/tables/serverProfile";
import { setUpdateValues } from "../../../../store/utils";


interface IServerProfileUpdates {
  timezoneOffset: string;
  serverOwnerId: string;
  updatedAt: string;
}

export const updateServerProfile = async (
    {
      discordServerId,
      updates,
    }: {
      discordServerId: string;
      updates?: IServerProfileUpdates;
    },
    { documentClient }
  ) => {
    const updateValues = setUpdateValues(updates);
    const updatedMemberActions = await documentClient
      .update({
        TableName: serverProfileTable.name.get(),
        Key: {
          discordServerId,
          ownerId: updates?.serverOwnerId,
        },
        ReturnValues: "UPDATED_NEW",
        UpdateExpression: updateValues.updateExpression,
        ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
        ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
      })
      .promise();
    return updatedMemberActions;
  };
  
  export const getServerProfile = async (
    { discordServerId, ownerId }: { discordServerId: string; ownerId?: string },
    { documentClient }
  ) => {
    const dbResult = await documentClient
      .query({
        TableName: serverProfileTable.name.get(),
        KeyConditionExpression: "#DYNOBASE_discordServerId = :pkey",
        ExpressionAttributeValues: {
          ":pkey": discordServerId,
          ...(ownerId && { ":ownerId": ownerId }),
        },
        ExpressionAttributeNames: {
          "#DYNOBASE_discordServerId": "discordServerId",
          ...(ownerId && { "#DYNOBASE_ownerId": "ownerId" }),
        },
        ScanIndexForward: true,
        ...(ownerId && {
          FilterExpression: "#DYNOBASE_ownerId = :ownerId",
        }),
      })
      .promise();
    const { Items = [] } = dbResult;
    const [Item] = Items;
    return Item;
  };