import { ArtifactsNames } from "../../../../embeds/templates/artifactsList";
import {
  getNewClassOptionsList,
  getOptionsList,
} from "../../../../embeds/templates/neverwinter/classesList";
import { availableSlotValue } from "../../../../embeds/templates/neverwinter/raid";
import { userStatusCodes } from "../storeOps/userStatus";
import {
  displayArtifactAsEmoji,
  extractShortArtifactNames,
  isEmoji,
} from "./artifactsRenderer";

export const memmberNotExist = availableSlotValue;


export const statusSymbols = {
  [userStatusCodes.RANK_I]: "Monki Press W <a:MonkeyPressW:1066222667180539975>",
  [userStatusCodes.RANK_II]: "Awkward Monki <a:awkward_monkey_look:881685228207374416>",
  [userStatusCodes.RANK_III]: "Boosted Monki <a:bigmonke:806304972178063370>",
  [userStatusCodes.RANK_IV]: "Slap Monki <a:MonkeySpecialSlap:1066225238754459659>",
  [userStatusCodes.RANK_V]: "Monki King <:MonkeyKing:1066215123762565151>",
};

export const defaultJoinStatus = userStatusCodes.RANK_I;

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
  userStatusCode = defaultJoinStatus
}) => {
  if (!memberId) {
    return memmberNotExist;
  }
  const emojiList = displayArtifactAsEmoji(artifactsList);
  return `<@${memberId}>\n${
    statusSymbols[userStatus]
  }\n${emojiList.join("|")}`;
};

export const extractFieldValueAttributes = ({
  fieldValueText = "",
  seperator = /[,|\s]+/,
}) => {
  const [memberIdValue = "", userStatusValue = "", artifactsValue = ""] =
    fieldValueText.split("\n");
  const memberId = memberIdValue.substring(2, memberIdValue.length - 1);
  const [userStatus = defaultJoinStatus] =
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
