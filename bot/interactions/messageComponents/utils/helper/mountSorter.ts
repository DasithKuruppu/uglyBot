import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import {
  availableSlotValue,
  previousAvailableSlotValue,
} from "../../../../embeds/templates/neverwinter/raid";
import { Category } from "../categorizeEmbedFields/categorizeEmbedFields";
import {
  extractFieldName,
  extractFieldValueAttributes,
} from "./embedFieldAttribute";

const getMembersMounts = (seperatedSections) => {
  const mountMembersList = [
    ...seperatedSections[Category.DPS],
    ...seperatedSections[Category.TANK],
    ...seperatedSections[Category.HEALER],
  ];
  const classNamesMap = new Map(NeverwinterClassesMap);
  const availableMembers = mountMembersList
    .filter(({ name, value }) => {
      return ![availableSlotValue, previousAvailableSlotValue].includes(value);
    })
    .map(({ name, value }) => {
      const { fieldName, optionalClasses } = extractFieldName({
        fieldNameText: name,
      });
      const { memberId, userStatus, artifactsList, mountsList } =
        extractFieldValueAttributes({ fieldValueText: value });

      return {
        name: memberId,
        className: fieldName,
        category:
          (classNamesMap.get(fieldName)?.type as Category) || Category.DPS,
        mounts: mountsList,
      };
    });
};
