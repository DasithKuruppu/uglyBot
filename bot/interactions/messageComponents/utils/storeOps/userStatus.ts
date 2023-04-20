import { APIInteractionGuildMember } from "discord.js";
import { userStatusTable } from "../../../../../pulumi/persistantStore/tables/userStatus";
import { setUpdateValues } from "../../../../store/utils";
import { fieldSorter } from "../helper/artifactsSorter";

export enum userStatusCodes {
  RANK_I = "001",
  RANK_II = "002",
  RANK_III = "003",
  RANK_IV = "004",
  RANK_V = "005",
  CENSORED = "006",
}

interface IUserStatusUpdates {
  interactingDiscordMemberId: string;
  statusName: string;
  statusCode: userStatusCodes;
  voted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const updateuserStatus = async (
    {
      discordMemberId,
      updates,
    }: {
      discordMemberId: string;
      updates?: IUserStatusUpdates;
    },
    { documentClient }
  ) => {
    const updateValues = setUpdateValues(updates);
    const updatedMemberActions = await documentClient
      .update({
        TableName: userStatusTable.name.get(),
        Key: {
          discordMemberId,
          userStatusInteraction: updates?.interactingDiscordMemberId,
        },
        ReturnValues: "UPDATED_NEW",
        UpdateExpression: updateValues.updateExpression,
        ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
        ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
      })
      .promise();
    return updatedMemberActions;
  };
  
  export const listUserStatusChanges = async (
    userId: string,
    { documentClient }
  ) => {
    const dbResult = await documentClient
      .query({
        TableName: userStatusTable.name.get(),
        KeyConditionExpression: "#DYNOBASE_discordMemberId = :pkey",
        ExpressionAttributeValues: {
          ":pkey": userId,
        },
        ExpressionAttributeNames: {
          "#DYNOBASE_discordMemberId": "discordMemberId",
        },
        ScanIndexForward: false,
      })
      .promise();
    const { Items = [] } = dbResult;
    return Items.sort(fieldSorter(["-updatedAt", "-createdAt"]));
  };
  