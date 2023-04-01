import { userAvailabilityTable } from "../../../../../pulumi/persistantStore/tables/userAvailability";
import { setUpdateValues } from "../../../../store/utils";


export const getUserAvailability = async (
  userId: string,
  { documentClient }
) => {
  const dbResult = await documentClient
    .query({
      TableName: userAvailabilityTable.name.get(),
      KeyConditionExpression: "#DYNOBASE_discordMemberId = :pkey",
      ExpressionAttributeValues: {
        ":pkey": userId,
      },
      ExpressionAttributeNames: {
        "#DYNOBASE_discordMemberId": "discordMemberId",
      },
      ScanIndexForward: true,
    })
    .promise();
  const { Items = [] } = dbResult;
  return Items;
};

interface IuserAvailabilityUpdates {
  availableDayUTC: string,
  availableStartTimeUTC: string,
  availableDuration: string,
}

export const updateUserAvailability = async (
  {
    discordMemberId,
    updates,
  }: {
    discordMemberId: string;
    updates?: IuserAvailabilityUpdates;
  },
  { documentClient }
) => {
  const date_time_composite = `${updates?.availableDayUTC}#${updates?.availableStartTimeUTC}`;
  const updateValues = setUpdateValues({...updates, date_time_composite});
  const updatedUserAvailability = await documentClient
    .update({
      TableName: userAvailabilityTable.name.get(),
      Key: {
        discordMemberId,
        availabilitySpecified: `${updates?.availableDayUTC}`,
      },
      ReturnValues: "UPDATED_NEW",
      UpdateExpression: updateValues.updateExpression,
      ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
      ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
    })
    .promise();
  return updatedUserAvailability;
};

export const removeUserAvailability = async (
  {
    discordMemberId,
    day,
  }: {
    discordMemberId: string;
    day: string
  },
  { documentClient }
) => {
  const updatedUserAvailability = await documentClient
    .delete({
      TableName: userAvailabilityTable.name.get(),
      Key: {
        discordMemberId,
        availabilitySpecified: day
      },
    })
    .promise();
  return updatedUserAvailability;
};
