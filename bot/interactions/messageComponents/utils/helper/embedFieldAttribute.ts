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
  classEmoji= ""
}) => {
  if (!memberId) {
    return memmberNotExist;
  }
  return `<@${memberId}>\n[${userStatus}]\n{${artifactsList.join(",")}}`;
};
