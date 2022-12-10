import { APIInteractionGuildMember } from "discord-api-types/v10";
import { membersTable } from "../../../../../pulumi/persistantStore/tables/members";
import { raidsTable } from "../../../../../pulumi/persistantStore/tables/raids";
import { setUpdateValues } from "../../../../store/utils";

export const updateRaid = async (
    { raidId, createdAt, updates }: { raidId: string; createdAt: string; updates?: any },
    { documentClient }
  ) => {
  const updateValues = setUpdateValues(updates);
  const updatedRaid = await documentClient
  .update({
    TableName: raidsTable.name.get(),
    Key: {
      raidId,
      createdAt: createdAt,
    },
    ReturnValues: "UPDATED_NEW",
    UpdateExpression: updateValues.updateExpression,
    ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
    ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
  })
  .promise();
  return updatedRaid;
  }