export const memmberNotExist = "available";
export enum userState {
  TENTATIVE = "Tentative",
  CONFIRMED = "Confirmed",
}
export const defaultJoinStatus = userState.TENTATIVE;

export const createFieldValue = ({
  memberId,
  userStatus = defaultJoinStatus,
  artifactsList = ["Artifacts N/A"],
  classEmoji = "",
}) => {
  if (!memberId) {
    return memmberNotExist;
  }
  return `<@${memberId}>\n[${userStatus}]\n{${artifactsList.join(",")}}`;
};

export const extractFieldValueAttributes = ({ fieldValueText = "" }) => {
  const [memberIdValue = "", userStatusValue = "", artifactsValue = ""] =
    fieldValueText.split("\n");
  const memberId = memberIdValue.substring(2, memberIdValue.length - 1);
  const userStatus = userStatusValue.substring(1, userStatusValue.length - 1);
  const artifactsList = artifactsValue
    .substring(1, artifactsValue.length - 1)
    .split(",");
  return { memberId, userStatus, artifactsList };
};
