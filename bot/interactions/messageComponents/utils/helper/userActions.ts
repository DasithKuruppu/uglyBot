import { APIEmbedField } from "discord-api-types/payloads/v10/channel";
import { availableSlotValue } from "../../../../embeds/templates/neverwinter/raid";
import { trialNamesList } from "../../../../registerCommands/commands";
import {
  Category,
  getSectionInfo,
  ISectionInfo,
} from "../categorizeEmbedFields/categorizeEmbedFields";

export enum Operation {
  INSERT = "insert",
  DELETE = "delete",
  REPLACE = "replace",
}

export const CategoryToTitleSectionMapper = (requestedCategory: Category) =>
  ({
    [Category.DPS.toString()]: Category.DPS_TITLE,
    [Category.HEALER.toString()]: Category.HEALER_TITLE,
    [Category.TANK.toString()]: Category.TANK_TITLE,
    [Category.WAITLIST.toString()]: Category.WAITLIST_TITLE,
  }[requestedCategory]);

export const TitleToCategorySectionMapper = (requestedCategory: Category) =>
  ({
    [Category.DPS_TITLE.toString()]: Category.DPS,
    [Category.HEALER_TITLE.toString()]: Category.HEALER,
    [Category.TANK_TITLE.toString()]: Category.TANK,
    [Category.WAITLIST_TITLE.toString()]: Category.WAITLIST,
  }[requestedCategory]);

export enum ActionConditions {
  USER_EXISTS_REQUESTED_SECTION = "userExistsRequestedSection",
  USER_EXISTS_DIFFERENT_SECTION = "userExistsDifferentSection",
  USER_DOES_NOT_EXIST_SECTION = "userNotExistSection",
  USER_EXITS_SECTION_FULL = "userExistSectionFull",
  REQUESTED_SECTION_FULL = "requestedSectionFull",
  WAIT_LIST_FULL = "waitListFull",
  USER_REMOVE = "userRemove",
  //USER_EXIST_WAITLIST = "userExistWaitList"
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

export const isFivePersonDungeon = (title = "") => {
  const [name] = title.split("-");
  return [
    trialNamesList.TOSM as string,
    trialNamesList.STANDARD_DUNGEON,
    trialNamesList.VOS,
    trialNamesList.REAPERS_CHALLENGE,
    trialNamesList.DWP,
  ].includes(name);
};

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
    seperatedSections,
  }: {
    currentUserSecInfo: ISectionInfo;
    requestedSectionInfo: ISectionInfo;
    waitListSectioninfo: ISectionInfo;
    userField: APIEmbedField;
    userIndex: number;
    seperatedSections: Record<Category, APIEmbedField[]>;
  }
): IActions[] => {
  const conditionsList = Object.entries(conditions)
    .filter(([name, isTrue]) => isTrue)
    .map(([name]) => name);

  const isRemoveUser = conditionsList.includes(ActionConditions.USER_REMOVE);

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
        {
          operation: Operation.REPLACE,
          sectionName: CategoryToTitleSectionMapper(
            requestedSectionInfo.sectionName
          ),
          field: {
            ...seperatedSections[
              CategoryToTitleSectionMapper(requestedSectionInfo.sectionName)
            ][0],
            value: `\`Capacity: ${
              requestedSectionInfo.sectionUserOccupyCount + 1
            } / ${requestedSectionInfo.sectionCapacity}\``,
          },
          index: 0,
        },
      ],
    },
    {
      conditions: [
        ActionConditions.USER_DOES_NOT_EXIST_SECTION,
        ActionConditions.WAIT_LIST_FULL,
        ActionConditions.USER_EXITS_SECTION_FULL,
      ],
      actions: [
        {
          operation: Operation.INSERT,
          sectionName: requestedSectionInfo.sectionName,
          field: userField,
          index: requestedSectionInfo.sectionUserOccupyCount,
        },
        {
          operation: Operation.REPLACE,
          sectionName: CategoryToTitleSectionMapper(
            requestedSectionInfo.sectionName
          ),
          field: {
            ...seperatedSections[
              CategoryToTitleSectionMapper(requestedSectionInfo.sectionName)
            ][0],
            value: `\`Capacity: ${
              requestedSectionInfo.sectionUserOccupyCount + 1
            } / ${requestedSectionInfo.sectionCapacity}\``,
          },
          index: 0,
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
        {
          operation: Operation.REPLACE,
          sectionName: Category.WAITLIST_TITLE,
          field: {
            ...seperatedSections[Category.WAITLIST_TITLE][0],
            value: `\`Capacity: ${
              waitListSectioninfo.sectionUserOccupyCount + 1
            } / ${waitListSectioninfo.sectionCapacity}\``,
          },
          index: 0,
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
      conditions: [
        ActionConditions.USER_EXISTS_REQUESTED_SECTION,
        ActionConditions.USER_EXITS_SECTION_FULL,
        ActionConditions.REQUESTED_SECTION_FULL,
      ],
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
      conditions: [
        ActionConditions.USER_EXISTS_REQUESTED_SECTION,
        ActionConditions.USER_EXITS_SECTION_FULL,
        ActionConditions.REQUESTED_SECTION_FULL,
        ActionConditions.WAIT_LIST_FULL,
      ],
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
      conditions: [
        ActionConditions.USER_EXITS_SECTION_FULL,
        ActionConditions.USER_EXISTS_DIFFERENT_SECTION,
        ActionConditions.WAIT_LIST_FULL,
      ],
      actions: [
        {
          operation: Operation.DELETE,
          sectionName: currentUserSecInfo.sectionName,
          field: userField,
          index: userIndex,
        },
        {
          operation: Operation.REPLACE,
          sectionName: CategoryToTitleSectionMapper(
            currentUserSecInfo.sectionName
          ),
          field: {
            ...seperatedSections[
              CategoryToTitleSectionMapper(currentUserSecInfo.sectionName)
            ][0],
            value: `\`Capacity: ${
              currentUserSecInfo.sectionUserOccupyCount - 1
            } / ${currentUserSecInfo.sectionCapacity}\``,
          },
          index: 0,
        },
        {
          operation: Operation.INSERT,
          sectionName: requestedSectionInfo.sectionName,
          field: userField,
          index: requestedSectionInfo.sectionUserOccupyCount,
        },
        {
          operation: Operation.REPLACE,
          sectionName: CategoryToTitleSectionMapper(
            requestedSectionInfo.sectionName
          ),
          field: {
            ...seperatedSections[
              CategoryToTitleSectionMapper(requestedSectionInfo.sectionName)
            ][0],
            value: `\`Capacity: ${
              requestedSectionInfo.sectionUserOccupyCount + 1
            } / ${requestedSectionInfo.sectionCapacity}\``,
          },
          index: 0,
        },
      ],
    },
    {
      conditions: [ActionConditions.USER_REMOVE],
      actions: [
        {
          operation: Operation.DELETE,
          sectionName: currentUserSecInfo.sectionName,
          field: userField,
          index: userIndex,
        },
        {
          operation: Operation.REPLACE,
          sectionName: CategoryToTitleSectionMapper(
            currentUserSecInfo.sectionName
          ),
          field: {
            ...seperatedSections[
              CategoryToTitleSectionMapper(currentUserSecInfo.sectionName)
            ][0],
            value: `\`Capacity: ${
              currentUserSecInfo.sectionUserOccupyCount - 1
            } / ${currentUserSecInfo.sectionCapacity}\``,
          },
          index: 0,
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
          operation: Operation.REPLACE,
          sectionName: CategoryToTitleSectionMapper(
            currentUserSecInfo.sectionName
          ),
          field: {
            ...seperatedSections[
              CategoryToTitleSectionMapper(currentUserSecInfo.sectionName)
            ][0],
            value: `\`Capacity: ${
              currentUserSecInfo.sectionUserOccupyCount - 1
            } / ${currentUserSecInfo.sectionCapacity}\``,
          },
          index: 0,
        },
        {
          operation: Operation.INSERT,
          sectionName: requestedSectionInfo.sectionName,
          field: userField,
          index: requestedSectionInfo.sectionUserOccupyCount,
        },
        {
          operation: Operation.REPLACE,
          sectionName: CategoryToTitleSectionMapper(
            requestedSectionInfo.sectionName
          ),
          field: {
            ...seperatedSections[
              CategoryToTitleSectionMapper(requestedSectionInfo.sectionName)
            ][0],
            value: `\`Capacity: ${
              requestedSectionInfo.sectionUserOccupyCount + 1
            } / ${requestedSectionInfo.sectionCapacity}\``,
          },
          index: 0,
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
          operation: Operation.REPLACE,
          sectionName: CategoryToTitleSectionMapper(
            currentUserSecInfo.sectionName
          ),
          field: {
            ...seperatedSections[
              CategoryToTitleSectionMapper(currentUserSecInfo.sectionName)
            ][0],
            value: `\`Capacity: ${
              currentUserSecInfo.sectionUserOccupyCount - 1
            } / ${currentUserSecInfo.sectionCapacity}\``,
          },
          index: 0,
        },
        {
          operation: Operation.INSERT,
          sectionName: requestedSectionInfo.sectionName,
          field: userField,
          index: requestedSectionInfo.sectionUserOccupyCount,
        },
        {
          operation: Operation.REPLACE,
          sectionName: CategoryToTitleSectionMapper(
            requestedSectionInfo.sectionName
          ),
          field: {
            ...seperatedSections[
              CategoryToTitleSectionMapper(requestedSectionInfo.sectionName)
            ][0],
            value: `\`Capacity: ${
              requestedSectionInfo.sectionUserOccupyCount + 1
            } / ${requestedSectionInfo.sectionCapacity}\``,
          },
          index: 0,
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
          operation: Operation.REPLACE,
          sectionName: CategoryToTitleSectionMapper(
            currentUserSecInfo.sectionName
          ),
          field: {
            ...seperatedSections[
              CategoryToTitleSectionMapper(currentUserSecInfo.sectionName)
            ][0],
            value: `\`Capacity: ${
              currentUserSecInfo.sectionUserOccupyCount - 1
            } / ${currentUserSecInfo.sectionCapacity}\``,
          },
          index: 0,
        },
        {
          operation:
            currentUserSecInfo.sectionName !== Category.WAITLIST
              ? Operation.INSERT
              : Operation.REPLACE,
          sectionName: Category.WAITLIST,
          field: userField,
          index:
            currentUserSecInfo.sectionName !== Category.WAITLIST
              ? waitListSectioninfo.sectionUserOccupyCount
              : userIndex,
        },

        {
          operation: Operation.REPLACE,
          sectionName: Category.WAITLIST_TITLE,
          field: {
            ...seperatedSections[Category.WAITLIST_TITLE][0],
            value: `\`Capacity: ${
              currentUserSecInfo.sectionName !== Category.WAITLIST
                ? waitListSectioninfo.sectionUserOccupyCount + 1
                : currentUserSecInfo.sectionUserOccupyCount
            } / ${waitListSectioninfo.sectionCapacity}\``,
          },
          index: 0,
        },
      ],
    },
  ];

  const foundResult = conditionsToActions.find(({ conditions }) => {
    return compareConditions(
      conditions,
      isRemoveUser ? [ActionConditions.USER_REMOVE] : conditionsList
    );
  });

  return foundResult ? foundResult.actions : [];
};
