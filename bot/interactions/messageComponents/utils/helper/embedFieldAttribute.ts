import { ArtifactsNames } from "../../../../embeds/templates/artifactsList";
import { getOptionsList } from "../../../../embeds/templates/neverwinter/classesList";
import { availableSlotValue } from "../../../../embeds/templates/neverwinter/raid";
import {
  displayArtifactAsEmoji,
  extractShortArtifactNames,
  isEmoji,
} from "./artifactsRenderer";

export const memmberNotExist = availableSlotValue;
export enum userState {
  TENTATIVE = "Tentative",
  CONFIRMED = "Confirmed",
  SPECIAL = "Special",
}
export const defaultJoinStatus = userState.CONFIRMED;

export const createFieldName = (
  {
    fieldName = "",
    optionalClasses = [],
  }: { fieldName: string; optionalClasses?: string[] },
  { classNamesList = [] }: { classNamesList: any[] }
) => {
  const foundClassName: { emoji?: any } =
    classNamesList.find(({ value }) => value === fieldName) || {};
  const { emoji: { id = "unknown", name = "unknown" } = {} } = foundClassName;
  const optionalClassesEmoji = optionalClasses.map((optionalClassName) => {
    const classDetails = classNamesList.find(
      ({ value }) => value === optionalClassName
    );
    const { emoji: { id = "unknown", name = "unknown" } = {} } = classDetails;
    return `<:${name}:${id}>`;
  });
  return foundClassName
    ? [`<:${name}:${id}>`, ...optionalClassesEmoji].join("|")
    : `❔ ${fieldName}`;
};

export const extractFieldName = (
  { fieldNameText = "" },
  {
    seperator = " ",
    classNamesList = getOptionsList(),
  }: { classNamesList?: any[]; seperator?: string } = {}
) => {
  const splitFieldName = fieldNameText.split(seperator);
  const [emojis, fieldName] = splitFieldName;
  const isEmoji = /<:.+:(.+)>/gi.test(fieldNameText);
  const classList = isEmoji
    ? emojis
        .split("|")
        .map((optionalClassEmoji) => {
          const emojiIdCaptureRegexp = /<:.+:(.+)>/gi;
          const [capturedText = "unknown", captureEmojiId = "unknown"] =
            emojiIdCaptureRegexp.exec(optionalClassEmoji) || [];
          const classDetails =
            classNamesList.find(({ emoji: { id, name } }) => {
              const isValid = id === captureEmojiId;
              return isValid;
            }) || {};
          const { value } = classDetails;
          return value;
        })
        .filter((valid) => valid)
    : [fieldName];
  const [primaryClass, ...optionalClasses] = classList;
  return { fieldName: primaryClass, optionalClasses };
};

export const createFieldValue = ({
  memberId,
  userStatus = defaultJoinStatus,
  artifactsList = ["Artifacts N/A"],
  classEmoji = "",
  specialStatusMembers = [
    "320419663349678101",
    "730863721672343583",
    "277713020267003904",
    "1057304365276336158",
    "1057291440587276339",
    "292745178119143433",
  ],
}) => {
  if (!memberId) {
    return memmberNotExist;
  }
  const isSpecialStatus = specialStatusMembers.includes(memberId);
  const processedUserStatus = isSpecialStatus ? userState.SPECIAL : userStatus;
  const statusSymbols = {
    [userState.CONFIRMED]: "I just press W 🐒",
    [userState.TENTATIVE]: "Primal 🦧",
    [userState.SPECIAL]: "Boosted <a:bigmonke:806304972178063370>",
  };
  const emojiList = displayArtifactAsEmoji(artifactsList);
  return `<@${memberId}>\n${
    statusSymbols[processedUserStatus]
  }\n${emojiList.join("|")}`;
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
