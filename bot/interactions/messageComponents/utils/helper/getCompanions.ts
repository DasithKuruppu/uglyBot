import { NeverwinterClassesMap } from "../../../../embeds/templates/neverwinter/classesList";
import {
  availableSlotValue,
  previousAvailableSlotValue,
} from "../../../../embeds/templates/neverwinter/raid";
import { Category } from "../categorizeEmbedFields/categorizeEmbedFields";
import { batchGetUsersList } from "../storeOps/members";
import {
  extractFieldName,
  extractFieldValueAttributes,
} from "./embedFieldAttribute";

export const getCompanionsOfMembers = async (
  seperatedSections,
  { documentClient }
) => {
  const members = [
    ...seperatedSections[Category.DPS],
    ...seperatedSections[Category.TANK],
    ...seperatedSections[Category.HEALER],
  ];
  const memberDetails = members
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
        discordMemberId: memberId,
        className: fieldName,
      };
    });
  console.log({ memberDetails });
  const memberCompanionsList = await batchGetUsersList(memberDetails, {
    documentClient,
  });
  return memberCompanionsList;
};
