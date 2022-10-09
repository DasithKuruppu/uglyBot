import { APIEmbedField } from "discord-api-types/payloads/v10/channel";
import { sectionTitleNames } from "../../../../embeds/templates/neverwinter/raid";
import { Category } from "../categorizeEmbedFields/categorizeEmbedFields";
import { convertToDiscordDate } from "../date/dateToDiscordTimeStamp";
import { TitleToCategorySectionMapper } from "./userActions";
export const createRaidContent = (
  previousText = "",
  {
    eventDate = undefined,
    userActionText = "",
  }: { eventDate?: string; userActionText?: string }
) => {
  const [extractEventDateText] = previousText.split("\n");
  const eventDateIsValid = extractEventDateText.includes("Event/Raid");
  const processedEventDate = eventDate
    ? `Event/Raid will start at ${convertToDiscordDate(eventDate)}`
    : eventDateIsValid
    ? extractEventDateText
    : "";

  return `${processedEventDate}\nLast activity(${convertToDiscordDate("now", {
    relative: true,
  })}) :\n${userActionText}`;
};

export interface IDetermineRaidTemplateType {
  embedFields: APIEmbedField[];
}

export const determineRaidTemplateType = ({
  embedFields,
}: IDetermineRaidTemplateType) => {
  const templateInfo = embedFields.reduce(
    (processed: any, { name, value, inline }, currentIndex) => {
      const {
        currentSectionCategoryTitle,
        currentSectionCategory,
        templateMetaInfo: templateMetaInfoPrevious = {},
      } = processed;
      const [newSectionTitle, newSectionTitleValue] =
        Object.entries(sectionTitleNames).find(
          ([sectionName, sectionTitle]) => {
            return sectionTitle === name;
          }
        ) || [];
      const isNewSection =
        newSectionTitle && currentSectionCategoryTitle !== newSectionTitle;
      const activeCategoryTitleSection = isNewSection
        ? newSectionTitle
        : currentSectionCategoryTitle;
      const activeCategorySection = TitleToCategorySectionMapper(
        activeCategoryTitleSection
      );
      const isLastIndex = currentIndex === embedFields.length - 1;
      if (!activeCategoryTitleSection) {
        return processed;
      }
      return {
        ...(!isLastIndex && {
          currentSectionCategoryTitle: activeCategoryTitleSection,
          currentSection: activeCategorySection,
        }),
        templateMetaInfo: {
          ...templateMetaInfoPrevious,
          ...(isNewSection && {
            [activeCategoryTitleSection]: {
              ...templateMetaInfoPrevious?.[activeCategoryTitleSection],
              count:
                (templateMetaInfoPrevious?.[activeCategoryTitleSection]
                  ?.count || 0) + 1,
            },
          }),
          ...(!isNewSection && {
            [activeCategorySection]: {
              ...templateMetaInfoPrevious?.[activeCategorySection],
              count:
                (templateMetaInfoPrevious?.[activeCategorySection]?.count ||
                  0) + 1,
            },
          }),
        },
      };
    },
    {}
  );
  const templateMetaInfo = templateInfo?.templateMetaInfo || {};
  const standardizedTemplateInfo = {
    templateMetaInfo: {
      [Category.DPS_TITLE]: {
        count: templateMetaInfo?.[Category.DPS_TITLE]?.count || 0,
      },
      [Category.DPS]: {
        count: templateMetaInfo?.[Category.DPS]?.count || 0,
      },
      [Category.TANK_TITLE]: {
        count: templateMetaInfo?.[Category.TANK_TITLE]?.count || 0,
      },
      [Category.TANK]: {
        count: templateMetaInfo?.[Category.TANK]?.count || 0,
      },
      [Category.HEALER_TITLE]: {
        count: templateMetaInfo?.[Category.HEALER_TITLE]?.count || 0,
      },
      [Category.HEALER]: {
        count: templateMetaInfo?.[Category.HEALER]?.count || 0,
      },
      [Category.WAITLIST_TITLE]: {
        count: templateMetaInfo?.[Category.WAITLIST_TITLE]?.count || 0,
      },
      [Category.WAITLIST]: {
        count: templateMetaInfo?.[Category.WAITLIST]?.count || 0,
      },
    },
    templateId: [
      templateMetaInfo?.[Category.DPS_TITLE]?.count || 0,
      templateMetaInfo?.[Category.DPS]?.count || 0,
      templateMetaInfo?.[Category.TANK_TITLE]?.count || 0,
      templateMetaInfo?.[Category.TANK]?.count || 0,
      templateMetaInfo?.[Category.HEALER_TITLE]?.count || 0,
      templateMetaInfo?.[Category.HEALER]?.count || 0,
      templateMetaInfo?.[Category.WAITLIST_TITLE]?.count || 0,
      templateMetaInfo?.[Category.WAITLIST]?.count || 0,
    ].join('U')
  };
  return standardizedTemplateInfo;
};
