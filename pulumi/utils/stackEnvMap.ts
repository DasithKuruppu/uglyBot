import { environmentTypes } from "../../bot/initializations/environments";
export const getEnvironmentFromStack = (stackName: string) => {
  return (
    {
      staging: environmentTypes.LAMBDA_STAGING,
      dev_ugly: environmentTypes.LAMBDA_DEVELOP,
    }[stackName] || environmentTypes.LAMBDA_DEVELOP
  );
};
