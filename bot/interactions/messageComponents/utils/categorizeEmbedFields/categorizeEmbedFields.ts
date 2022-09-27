import { APIEmbedField } from "discord-api-types/payloads/v10/channel";
import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import { IfactoryInitializations } from "../../typeDefinitions/event";
import {
  ActionConditions,
  conditionsToActionsMapper,
  executeEmbedFieldsActions,
  Operation,
} from "../helper/userActions";
export const availableSlotValue = "available";
export enum Category {
  DPS_TITLE = "DPS_TITLE",
  DPS = "DPS",
  TANK_TITLE = "TANK_TITLE",
  TANK = "TANK",
  HEALER_TITLE = "HEAL_TITLE",
  HEALER = "HEAL",
  WAITLIST_TITLE = "WAITLIST_TITLE",
  WAITLIST = "WAITLIST",
}

export type ISectionSeperation = Record<
  Category,
  { start: number; end: number }
>;

const defaultSeperation: ISectionSeperation = {
  [Category.DPS_TITLE]: { start: 0, end: 1 },
  [Category.DPS]: { start: 1, end: 7 },
  [Category.TANK_TITLE]: { start: 7, end: 8 },
  [Category.TANK]: { start: 8, end: 10 },
  [Category.HEALER_TITLE]: { start: 10, end: 11 },
  [Category.HEALER]: { start: 11, end: 13 },
  [Category.WAITLIST_TITLE]: { start: 13, end: 14 },
  [Category.WAITLIST]: { start: 14, end: 19 },
};

interface IExistingMemberRecordDetails {
  userExists: boolean;
  userIndex: number;
  userRecord?: APIEmbedField;
  sectionName?: Category;
  sectionUserOccupyCount: number;
  sectionCapacity: number;
  userStatus?: string;
  userArtifacts?: string;
}

export interface ISectionInfo {
  sectionUserOccupyCount: number;
  sectionCapacity: number;
  sectionFull: boolean;
  sectionName: Category;
}

export const getSectionInfo = (
  seperatedSections: Record<Category, APIEmbedField[]>,
  sectionName: Category = Category.WAITLIST
): ISectionInfo => {
  const sectionRecords = seperatedSections[sectionName];
  const sectionUserOccupyCount =
    sectionRecords.filter(({ name, value }) => {
      return value !== availableSlotValue;
    }).length || 0;
  const sectionCapacity = sectionRecords.length || 0;
  const sectionFull = sectionUserOccupyCount >= sectionCapacity;
  return {
    sectionUserOccupyCount,
    sectionCapacity,
    sectionFull,
    sectionName,
  };
};

export const getExistingMemberRecordDetails = (
  seperatedSections: Record<Category, APIEmbedField[]>,
  memberId: string,
  { seperator = "\n" } = {}
) => {
  const sectionKeys = Object.keys(seperatedSections) as Category[];
  const existingRecordDetails: IExistingMemberRecordDetails[] =
    sectionKeys.reduce(
      (
        accumulated: IExistingMemberRecordDetails[],
        currentSectionName = Category.WAITLIST
      ) => {
        const sectionRecords = seperatedSections[currentSectionName];
        const currentUserSecInfo = getSectionInfo(
          seperatedSections,
          currentSectionName || Category.WAITLIST
        );
        const foundUserIndex = sectionRecords.findIndex(({ value, name }) => {
          const [currentMemberId] = value.split(seperator);
          return currentMemberId === `<@${memberId}>`;
        });
        const userExists: boolean = foundUserIndex >= 0 ? true : false;
        const [userId, userStatus, userArtifacts] = userExists
          ? sectionRecords[foundUserIndex].value.split(seperator)
          : [];

        const returnResult = userExists
          ? [
              ...accumulated,
              {
                userExists,
                userIndex: foundUserIndex,
                userRecord: sectionRecords[foundUserIndex],
                userStatus,
                userArtifacts,
                sectionName: currentSectionName,
                sectionUserOccupyCount:
                  currentUserSecInfo.sectionUserOccupyCount,
                sectionCapacity: currentUserSecInfo.sectionCapacity,
              },
            ]
          : accumulated;
        return returnResult;
      },
      []
    );
  return existingRecordDetails;
};

export interface IActions {
  operation: Operation;
  sectionName: Category;
  field: APIEmbedField;
  index: number;
}

export const determineActions = (
  seperatedSections: Record<Category, APIEmbedField[]>,
  {
    memberId,
    requestedUserSection,
    userField,
    factoryInits,
  }: {
    memberId: string;
    requestedUserSection: Category;
    userField: APIEmbedField;
    factoryInits: IfactoryInitializations;
  }
) => {
  const { logger } = factoryInits;
  const existingUserIdSections = getExistingMemberRecordDetails(
    seperatedSections,
    memberId
  );
  const [
    {
      sectionName = undefined,
      userExists = false,
      userIndex = 0,
      userRecord = undefined,
    } = {},
  ] = existingUserIdSections;

  const currentUserSecInfo = getSectionInfo(
    seperatedSections,
    sectionName || Category.WAITLIST
  );

  const requestedSectionInfo = getSectionInfo(
    seperatedSections,
    requestedUserSection || Category.WAITLIST
  );
  const waitListSectioninfo = getSectionInfo(
    seperatedSections,
    Category.WAITLIST
  );
  const conditions = {
    [ActionConditions.USER_DOES_NOT_EXIST_SECTION]: !userExists,
    [ActionConditions.USER_EXISTS_REQUESTED_SECTION]:
      sectionName === requestedUserSection,
    [ActionConditions.USER_EXISTS_DIFFERENT_SECTION]:
      sectionName !== requestedUserSection && userExists,
    [ActionConditions.USER_EXITS_SECTION_FULL]: currentUserSecInfo.sectionFull,
    [ActionConditions.REQUESTED_SECTION_FULL]: requestedSectionInfo.sectionFull,
    [ActionConditions.WAIT_LIST_FULL]: waitListSectioninfo.sectionFull,
  };

  const actionsList = conditionsToActionsMapper(conditions, {
    currentUserSecInfo,
    requestedSectionInfo,
    waitListSectioninfo,
    userField,
    userIndex,
  });

  logger.log("info", "actions to perform", { actionsList, conditions, currentUserSecInfo, requestedSectionInfo });
  const updatedSections = actionsList
    ? executeEmbedFieldsActions({ actionsList, seperatedSections })
    : seperatedSections;
  return Object.keys(defaultSeperation).reduce(
    (accumulatedList: APIEmbedField[], currentSectionName) => {
      return [...accumulatedList, ...updatedSections[currentSectionName]];
    },
    []
  );
};

export const getEmbedFieldsSeperatedSections = (
  fieldsList: APIEmbedField[],
  seperateSection: ISectionSeperation = defaultSeperation
): Record<Category, APIEmbedField[]> => {
  const categoryList = [
    Category.DPS_TITLE,
    Category.DPS,
    Category.TANK_TITLE,
    Category.TANK,
    Category.HEALER_TITLE,
    Category.HEALER,
    Category.WAITLIST_TITLE,
    Category.WAITLIST,
  ];
  const seperatedSections = categoryList.reduce(
    (reducedCategories, current) => {
      return {
        ...reducedCategories,
        [current]: fieldsList.slice(
          seperateSection[current].start,
          seperateSection[current].end
        ),
      };
    },
    {}
  );
  return seperatedSections as Record<Category, APIEmbedField[]>;
};
