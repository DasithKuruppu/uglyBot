import { APIEmbedField } from "discord-api-types/payloads/v10/channel";
import {
  availableSlotValue,
  Category,
  getSectionInfo,
  ISectionInfo,
} from "../categorizeEmbedFields/categorizeEmbedFields";

export enum Operation {
  INSERT = "insert",
  DELETE = "delete",
  REPLACE = "replace",
}

export enum ActionConditions {
  USER_EXISTS_REQUESTED_SECTION = "userExistsRequestedSection",
  USER_EXISTS_DIFFERENT_SECTION = "userExistsDifferentSection",
  USER_DOES_NOT_EXIST_SECTION = "userNotExistSection",
  USER_EXITS_SECTION_FULL = "userExistSectionFull",
  REQUESTED_SECTION_FULL = "requestedSectionFull",
  WAIT_LIST_FULL = "waitListFull",
}

export interface IActions {
  operation: Operation;
  sectionName: Category;
  field: APIEmbedField;
  index: number;
}

export interface IEmbedFieldActionsArgs {
  actionsList: IActions[];
  seperatedSections: Record<Category, APIEmbedField[]>;
}

export const executeEmbedFieldsActions = ({
  actionsList,
  seperatedSections,
}: IEmbedFieldActionsArgs): Record<Category, APIEmbedField[]> => {
  return actionsList.reduce((accumulated, current) => {
    const OperationName = current.operation;
    const fieldsInSection = accumulated[current.sectionName];

    switch (OperationName) {
      case Operation.INSERT: {
        const skipOneRight = current.index + 1;
        const leftHalf = fieldsInSection.slice(0, current.index);
        const rightHalf = fieldsInSection.slice(skipOneRight);
        return {
          ...accumulated,
          [current.sectionName]: [...leftHalf, current.field, ...rightHalf],
        };
      }

      case Operation.REPLACE: {
        const skipOneRight = current.index + 1;
        const leftHalf = fieldsInSection.slice(0, current.index);
        const rightHalf = fieldsInSection.slice(skipOneRight);
        return {
          ...accumulated,
          [current.sectionName]: [...leftHalf, current.field, ...rightHalf],
        };
      }

      case Operation.DELETE: {
        const skipOneRight = current.index + 1;
        const leftHalf = fieldsInSection.slice(0, current.index);
        const rightHalf = fieldsInSection.slice(skipOneRight);
        const emptyField: APIEmbedField = {
          value: availableSlotValue,
          name: current.sectionName,
          inline: !!fieldsInSection[current.index]?.inline,
        };
        return {
          ...accumulated,
          [current.sectionName]: [...leftHalf, ...rightHalf, emptyField],
        };
      }
      default: {
        return accumulated;
      }
    }
  }, seperatedSections);
};
export const compareConditions = (
  mappableConditions: string[] = [],
  conditionsListToCompare: string[] = []
) => {
  return conditionsListToCompare.reduce(
    (previousConditionState, currentCondition) =>
      previousConditionState && mappableConditions.includes(currentCondition),
    true
  );
};

export const conditionsToActionsMapper = (
  conditions: { [key in ActionConditions]: boolean },
  {
    currentUserSecInfo,
    requestedSectionInfo,
    waitListSectioninfo,
    userIndex,
    userField,
  }: {
    currentUserSecInfo: ISectionInfo;
    requestedSectionInfo: ISectionInfo;
    waitListSectioninfo: ISectionInfo;
    userField: APIEmbedField;
    userIndex: number;
  }
): IActions[] => {
  const conditionsList = Object.entries(conditions)
    .filter(([name, isTrue]) => isTrue)
    .map(([name]) => name);

  const conditionsToActions: {
    conditions: ActionConditions[];
    actions: IActions[];
  }[] = [
    {
      conditions: [ActionConditions.USER_DOES_NOT_EXIST_SECTION],
      actions: [
        {
          operation: Operation.INSERT,
          sectionName: requestedSectionInfo.sectionName,
          field: userField,
          index: requestedSectionInfo.sectionUserOccupyCount,
        },
      ],
    },
    {
      conditions: [
        ActionConditions.USER_DOES_NOT_EXIST_SECTION,
        ActionConditions.REQUESTED_SECTION_FULL,
      ],
      actions: [
        {
          operation: Operation.INSERT,
          sectionName: Category.WAITLIST,
          field: userField,
          index: waitListSectioninfo.sectionUserOccupyCount,
        },
      ],
    },
    {
      conditions: [ActionConditions.USER_EXISTS_REQUESTED_SECTION],
      actions: [
        {
          operation: Operation.REPLACE,
          sectionName: requestedSectionInfo.sectionName,
          field: userField,
          index: userIndex,
        },
      ],
    },
    {
      conditions: [ActionConditions.USER_EXISTS_DIFFERENT_SECTION],
      actions: [
        {
          operation: Operation.DELETE,
          sectionName: currentUserSecInfo.sectionName,
          field: userField,
          index: userIndex,
        },
        {
          operation: Operation.INSERT,
          sectionName: requestedSectionInfo.sectionName,
          field: userField,
          index: requestedSectionInfo.sectionUserOccupyCount,
        },
      ],
    },
    {
      conditions: [
        ActionConditions.USER_EXISTS_DIFFERENT_SECTION,
        ActionConditions.USER_EXITS_SECTION_FULL,
      ],
      actions: [
        {
          operation: Operation.DELETE,
          sectionName: currentUserSecInfo.sectionName,
          field: userField,
          index: userIndex,
        },
        {
          operation: Operation.INSERT,
          sectionName: Category.WAITLIST,
          field: userField,
          index: waitListSectioninfo.sectionUserOccupyCount,
        },
      ],
    },
    {
      conditions: [
        ActionConditions.USER_EXISTS_DIFFERENT_SECTION,
        ActionConditions.REQUESTED_SECTION_FULL,
      ],
      actions: [
        {
          operation: Operation.DELETE,
          sectionName: currentUserSecInfo.sectionName,
          field: userField,
          index: userIndex,
        },
        {
          operation: Operation.INSERT,
          sectionName: Category.WAITLIST,
          field: userField,
          index: waitListSectioninfo.sectionUserOccupyCount,
        },
      ],
    },
  ];

  const foundResult = conditionsToActions.find(({ conditions }) => {
    return compareConditions(conditions, conditionsList);
  });

  return foundResult ? foundResult.actions : [];
};
