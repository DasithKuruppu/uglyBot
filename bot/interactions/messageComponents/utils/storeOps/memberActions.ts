import { memberActionsTable } from "../../../../../pulumi/persistantStore/tables/memberActions";
import { setUpdateValues } from "../../../../store/utils";

export enum ACTIVITY_STATUS {
  JOINED = "Joined[default]",
  JOINED_WAITLIST = "Joined[WaitList]",
  JOINED_CLASS_SELECT = "Joined[ClassSelect]",
  JOINED_ARTIFACT_SELECT = "Joined[ArtifactSelect]",
  RAGE_QUIT= "Left[RageQuit]"
}

interface IMemberActionsUpdates {
  status: ACTIVITY_STATUS;
  raidId: string;
  currentSection: string;
  requestedSectionName: string;
  raidTitle: string;
  raidType: string;
  raidTime: number;
  artifactsList: string[];
  primaryClassName: string;
  optionalClassesNames: string[];
  serverId: string;
  channelId: string;
  token: string;
  createdAt: number;
  embed: string;
  hasPendingUpdates: boolean;
  pendingUpdate: string[];
}
export const updateActions = async (
    { compositeRaidStatusDate, discordMemberId, updates }: { discordMemberId:string, compositeRaidStatusDate: string, updates?: IMemberActionsUpdates },
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
  }