import { APIInteractionGuildMember } from "discord.js";
import { botMessagesTable } from "../../../../../pulumi/persistantStore/tables/uglyBotMessages";
import { setUpdateValues } from "../../../../store/utils";

interface IBotMessage {
  discordMemberId: string;
  userName: string;
  message: string;
  reply: string;
  token: string;
  category: string;
  context: string;
  previousMessages: string[];
  updatedAt: string;
  createdAt: string;
}

export const updateBotMessage = async (
  {
    discordMemberId,
    updates,
  }: {
    discordMemberId: string;
    updates?: IBotMessage;
  },
  { documentClient }
) => {
  const { userName, ...otherUpdates } = updates || {};
  const updateValues = setUpdateValues(otherUpdates);
  const updatedMemberProfile = await documentClient
    .update({
      TableName: botMessagesTable.name.get(),
      Key: {
        discordMemberId,
        userName,
      },
      ReturnValues: "UPDATED_NEW",
      UpdateExpression: updateValues.updateExpression,
      ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
      ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
    })
    .promise();
  return updatedMemberProfile;
};

export const getBotMessages = async (
  { discordMemberId, userName }: { discordMemberId: string; userName?: string },
  { documentClient }
) => {
  const dbResult = await documentClient
    .query({
      TableName: botMessagesTable.name.get(),
      KeyConditionExpression: "#DYNOBASE_discordMemberId = :pkey",
      ExpressionAttributeValues: {
        ":pkey": discordMemberId,
        ...(userName && { ":userName": userName }),
      },
      ExpressionAttributeNames: {
        "#DYNOBASE_discordMemberId": "discordMemberId",
        ...(userName && { "#DYNOBASE_userName": "userName" }),
      },
      ScanIndexForward: true,
      ...(userName && {
        FilterExpression: "#DYNOBASE_userName = :userName",
      }),
    })
    .promise();
  const { Items = [] } = dbResult;
  const [Item] = Items;
  return Item;
};
