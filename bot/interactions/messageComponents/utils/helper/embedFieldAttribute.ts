import { ArtifactsNames } from "../../../../embeds/templates/artifactsList";
import {
  getNewClassOptionsList,
  getOptionsList,
} from "../../../../embeds/templates/neverwinter/classesList";
import { availableSlotValue } from "../../../../embeds/templates/neverwinter/raid";
import {
  displayArtifactAsEmoji,
  extractShortArtifactNames,
  isEmoji,
} from "./artifactsRenderer";

export const memmberNotExist = availableSlotValue;
export enum userState {
  TRAINEE = "Trainee",
  EXPERIENCED = "Experienced",
  SEMIEXPERIENCED = "Semi_Experienced",
  MASTERED = "Mastered",
  SPECIAL = "Special",
}

const statusSymbols = {
  [userState.TRAINEE]: "I just press W 🐒",
  [userState.EXPERIENCED]: "Experienced 🦧",
  [userState.MASTERED]: "King Kong <a:bigmonke:806304972178063370>",
  [userState.SEMIEXPERIENCED]: "Ooga Booga 🦧",
  [userState.SPECIAL]: "Boosted <a:bigmonke:806304972178063370>",
};

export const defaultJoinStatus = userState.TRAINEE;

export const createFieldName = (
  {
    fieldName = "",
    optionalClasses = [],
  }: { fieldName: string; optionalClasses?: string[] },
  {
    classNamesList = [],
    newClassNamesList = getNewClassOptionsList(),
  }: { classNamesList: any[]; newClassNamesList?: any[] }
) => {
  const foundClassName: { emoji?: any } =
    newClassNamesList.find(({ value }) => value === fieldName) ||
    classNamesList.find(({ value }) => value === fieldName) ||
    {};
  const { emoji: { id = "unknown", name = "unknown" } = {} } = foundClassName;
  const optionalClassesEmoji = optionalClasses.map((optionalClassName) => {
    const classDetails =
      newClassNamesList.find(({ value }) => value === optionalClassName) ||
      classNamesList.find(({ value }) => value === optionalClassName);
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
    newClassNamesList = getNewClassOptionsList(),
  }: {
    classNamesList?: any[];
    newClassNamesList?: any[];
    seperator?: string;
  } = {}
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
            newClassNamesList.find(({ emoji: { id, name } }) => {
              const isValid = id === captureEmojiId;
              return isValid;
            }) ||
            classNamesList.find(({ emoji: { id, name } }) => {
              const isValid = id === captureEmojiId;
              return isValid;
            }) ||
            {};
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
  const [userStatus = userState.TRAINEE] =
    Object.entries(statusSymbols).find(
      ([key, value]) => value === userStatusValue
    ) || [];
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
