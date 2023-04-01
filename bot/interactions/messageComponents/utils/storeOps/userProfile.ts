import { APIInteractionGuildMember } from "discord.js";
import { userProfileTable } from "../../../../../pulumi/persistantStore/tables/userProfile";
import { setUpdateValues } from "../../../../store/utils";

interface IUserProfileUpdates {
  timezoneOffset?: string;
  updatedAt: string;
  prefferedTrials?: string[];
  preferredRunTypes?: string[];
  userName: string;
}

export const updateUserProfile = async (
  {
    discordMemberId,
    updates,
  }: {
    discordMemberId: string;
    updates?: IUserProfileUpdates;
  },
  { documentClient }
) => {
  const { userName, ...otherUpdates } = updates || {};
  const updateValues = setUpdateValues(otherUpdates);
  const updatedMemberProfile = await documentClient
    .update({
      TableName: userProfileTable.name.get(),
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

export const getUserProfile = async (
  { discordMemberId, userName }: { discordMemberId: string; userName?: string },
  { documentClient }
) => {
  const dbResult = await documentClient
    .query({
      TableName: userProfileTable.name.get(),
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
