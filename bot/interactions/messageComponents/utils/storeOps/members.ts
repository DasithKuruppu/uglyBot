import { setUpdateValues } from "../../../../store/utils";
import { membersTable } from "../../../../../pulumi/persistantStore/tables/members";

export const getAllUsersClass = async (userId, { documentClient }) => {
  const dbResult = await documentClient
    .query({
      TableName: membersTable.name.get(),
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

export const updateMemberStatus = async (
  userId,
  { userStatus },
  { documentClient }
) => {
  const allUserClasses = await getAllUsersClass(userId, { documentClient });
  
  const updateValues = setUpdateValues({ userStatus });
  console.log({allUserClasses, updateValues});
  await Promise.all(
    allUserClasses.map(({ className }) => {
      return documentClient
        .update({
          TableName: membersTable.name.get(),
          Key: {
            discordMemberId: userId,
            className,
          },
          ReturnValues: "UPDATED_NEW",
          UpdateExpression: updateValues.updateExpression,
          ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
          ExpressionAttributeValues:
            updateValues.updateExpressionAttributeValues,
        })
        .promise();
    })
  );
};
