import { APIInteractionGuildMember } from "discord.js";
import { memberActionsTable } from "../../../../../pulumi/persistantStore/tables/memberActions";
import { setUpdateValues } from "../../../../store/utils";
import { fieldSorter } from "../helper/artifactsSorter";

export enum ACTIVITY_STATUS {
  JOINED = "Joined[Confirmed]",
  JOINED_WAITLIST = "Joined[WaitList]",
  JOINED_CLASS_SELECT = "Joined[ClassSelect]",
  JOINED_ARTIFACT_SELECT = "Joined[ArtifactSelect]",
  JOINED_MOUNT_SELCT = "Joined[MountSelect]",
  RAGE_QUIT = "Left[RageQuit]",
  REMOVED = "Removed",
}

export interface IMemberActionsUpdates {
  status: ACTIVITY_STATUS;
  raidId: string;
  currentSection: string;
  requestedSectionName: string;
  raidTitle: string;
  raidType: string;
  raidTime: number;
  artifactsList: string[];
  mountsList: string[];
  primaryClassName: string;
  optionalClassesNames: string[];
  serverId: string;
  channelId: string;
  token: string;
  createdAt: number;
  embed: string;
  metaData?: any;
  hasPendingUpdates: boolean;
  pendingUpdate: string[] | string;
}
export const updateActions = async (
  {
    compositeRaidStatusDate,
    discordMemberId,
    updates,
  }: {
    discordMemberId: string;
    compositeRaidStatusDate: string;
    updates?: IMemberActionsUpdates;
  },
  { documentClient }
) => {
  const updateValues = setUpdateValues(updates);
  const updatedMemberActions = await documentClient
    .update({
      TableName: memberActionsTable.name.get(),
      Key: {
        discordMemberId,
        compositeRaidStatusDate,
      },
      ReturnValues: "UPDATED_NEW",
      UpdateExpression: updateValues.updateExpression,
      ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
      ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
    })
    .promise();
  return updatedMemberActions;
};

export const getMemberActions = async (
  member: APIInteractionGuildMember,
  { documentClient }
) => {
  const dbResult = await documentClient
    .query({
      TableName: memberActionsTable.name.get(),
      KeyConditionExpression: "#DYNOBASE_discordMemberId = :pkey",
      ExpressionAttributeValues: {
        ":pkey": member?.user?.id,
      },
      ExpressionAttributeNames: {
        "#DYNOBASE_discordMemberId": "discordMemberId",
      },
      ScanIndexForward: false,
      Limit: 3
    })
    .promise();
  const { Items = [] } = dbResult;
  return Items.sort(fieldSorter(["-updatedAt", "-createdAt"]));
};
