import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField } from "discord.js";
import {
  getOptionsList,
  NeverwinterClassesMap,
  defaultClassName,
} from "../../../../embeds/templates/neverwinter/classesList";
import { raidConfigs } from "../../../../embeds/templates/neverwinter/config";
import { IfactoryInitializations } from "../../../typeDefinitions/event";
import {
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import {
  extractShortArtifactNames,
  isEmoji,
} from "../../utils/helper/artifactsRenderer";
import {
  createEmbedArtifactSortContent,
} from "../../utils/helper/artifactsSorter";
import {
  createFieldValue,
  userState,
  defaultJoinStatus,
  createFieldName,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
  getRaidTitle,
} from "../../utils/helper/raid";
import { getLastUsersClass } from "../../utils/storeOps/fetchData";

export const waitlistButtonInteract = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    documentClient,
    interactionConfig: { application_id, token, member, message },
  } = factoryInits;
  const currentFields = message.embeds[0].fields || [];
  const raidTitle = getRaidTitle(message.embeds[0]?.title);
  const { templateId } = determineRaidTemplateType({
    embedFields: currentFields || [],
  });
  const sectionSeperation = raidConfigs[templateId];
  const seperatedSections = getEmbedFieldsSeperatedSections(
    currentFields,
    sectionSeperation
  );
  const defaultClass = getOptionsList().find(
    ({ value }) => value === defaultClassName
  );
  const PersistedClassInfo = await getLastUsersClass(member, {
    documentClient,
  });
  const defaultSelectedClassType =
    (new Map(NeverwinterClassesMap).get(
      PersistedClassInfo?.className || defaultClass?.value
    )?.type as Category) || Category.WAITLIST;
  logger.log("info", "waitlist button", { seperatedSections });
  const [
    {
      userArtifacts = "",
      userExists = false,
      userStatus = defaultJoinStatus,
      optionalClasses = [],
      userRecord = {},
      sectionName = defaultSelectedClassType,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, member.user.id);
  const userArtifactsParse = userExists
    ? userArtifacts.replace(/[\{\}]+/gi, "").split(/[,|\s]+/)
    : undefined;
  const [firstArtifact = "unknown"] = userArtifactsParse || [];
  const isEmojiText = isEmoji(firstArtifact);
  const emojiProcessedArtifactlist = isEmojiText
    ? extractShortArtifactNames(userArtifactsParse)
    : userArtifactsParse;
  const creatableField: EmbedField = {
    name: createFieldName(
      {
        fieldName:
          (userRecord as EmbedField)?.name ||
          PersistedClassInfo?.className ||
          (defaultClass?.value as string),
        optionalClasses: userExists ? optionalClasses : PersistedClassInfo?.optionalClasses,
      },
      { classNamesList: getOptionsList() }
    ),
    value: createFieldValue({
      memberId: member.user.id,
      userStatus: userState.CONFIRMED,
      artifactsList: userArtifactsParse
        ? emojiProcessedArtifactlist
        : PersistedClassInfo?.artifactsList,
    }),
    inline: true,
  };

  const { updatedFieldsList, updatedSections } = determineActions(
    seperatedSections,
    {
      memberId: member.user.id,
      requestedUserSection: Category.WAITLIST,
      userField: creatableField,
      factoryInits,
      defaultSeperation: sectionSeperation,
    }
  );

  logger.log("info", "updated fields list", {
    updatedFieldsList,
    creatableField,
    userRecord,
  });
  return {
    body: {
      embeds: [{ ...message.embeds[0], fields: updatedFieldsList }],
      content: createRaidContent(message.content, {
        userActionText: `<@${member.user.id}> joined wait list!`,
        userArtifacts: createEmbedArtifactSortContent(
          updatedSections,
          raidTitle
        ),
      }),
    },
  };
};
