export const setUpdateValues = (updateValues) => {
  return Object.entries(updateValues).reduce(
    (
      {
        updateExpression = "",
        updateExpressionAttributeNames = {},
        updateExpressionAttributeValues = {},
      },
      [key, value]
    ) => {
      return ({updateExpression: updateExpression + `${
        updateExpression.length > 0
          ? `, #${key} = :${key} `
          : `SET #${key} = :${key} `
      }`,
      updateExpressionAttributeNames: {...updateExpressionAttributeNames,[`#${key}`]: key},
      updateExpressionAttributeValues:{...updateExpressionAttributeValues,[`:${key}`] : value}
    })},
    {} as any
  );
};
