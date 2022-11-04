import { ArtifactsNames } from "../../../../embeds/templates/artifactsList";
import {
  displayArtifactAsEmoji,
  extractShortArtifactNames,
  isEmoji,
} from "./artifactsRenderer";

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
  const emojiList = displayArtifactAsEmoji(artifactsList);
  return `<@${memberId}>\n[${userStatus}]\n${emojiList.join("|")}`;
};

export const extractFieldValueAttributes = ({
  fieldValueText = "",
  seperator = /[,|\s]+/,
}) => {
  const [memberIdValue = "", userStatusValue = "", artifactsValue = ""] =
    fieldValueText.split("\n");
  const memberId = memberIdValue.substring(2, memberIdValue.length - 1);
  const userStatus = userStatusValue.substring(1, userStatusValue.length - 1);
  const artifactsList = artifactsValue
    .replace(/[\{\}]+/gi, "")
    .split(seperator);
  const [firstArtifact = "unknown"] = artifactsList;
  const isEmojiText = isEmoji(firstArtifact);

  return {
    memberId,
    userStatus,
    artifactsList: isEmojiText
      ? extractShortArtifactNames(artifactsList)
      : artifactsList,
  };
};
