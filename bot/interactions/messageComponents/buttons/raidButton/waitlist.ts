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
import { createEmbedArtifactSortContent } from "../../utils/helper/artifactsSorter";
import {
  createFieldValue,
  defaultJoinStatus,
  createFieldName,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
  getRaidTime,
  getRaidTitle,
} from "../../utils/helper/raid";
import { getLastUsersClass } from "../../utils/storeOps/fetchData";
import {
  ACTIVITY_STATUS,
  updateActions,
} from "../../utils/storeOps/memberActions";
import { userStatusCodes } from "../../utils/storeOps/userStatus";

export const waitlistButtonInteract = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    documentClient,
    interactionConfig: {
      application_id,
      guild_id,
      channel_id,
      token,
      member,
      message,
    },
  } = factoryInits;
  const currentFields = message.embeds[0].fields || [];
  const messageContent = message?.content;
  const messageEmbed = message.embeds[0];
  const [unprocessedRaidId, unprocessedRaidTime] =
    messageEmbed.description?.split("\n") as string[];
  const raidTime = getRaidTime(unprocessedRaidTime.replace("⏱️ ", ""));
  const raidId = unprocessedRaidId.replace("🆔 ", "");
  const { raidTitle, raidType } = getRaidTitle(message.embeds[0]?.title);
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
  const persistedClassInfo = await getLastUsersClass(member, {
    documentClient,
  });
  const defaultSelectedClassType =
    (new Map(NeverwinterClassesMap).get(
      persistedClassInfo?.className || defaultClass?.value
    )?.type as Category) || Category.WAITLIST;
  logger.log("info", "waitlist button", { seperatedSections });
  const [
    {
      userArtifacts = undefined,
      userExists = false,
      userStatus = defaultJoinStatus,
      optionalClasses = [],
      userRecord = {},
      sectionName = defaultSelectedClassType,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, member.user.id);
  const artifactsList = userArtifacts || persistedClassInfo?.artifactsList || [];
  const primaryClassName =
    (userRecord as EmbedField)?.name ||
    persistedClassInfo?.className ||
    (defaultClass?.value as string);
  const optionalClassesNames = userExists
    ? optionalClasses
    : persistedClassInfo?.optionalClasses;

  const mountList = persistedClassInfo?.mountsList || [];
  const creatableField: EmbedField = {
    name: createFieldName(
      {
        fieldName:
          (userRecord as EmbedField)?.name ||
          persistedClassInfo?.className ||
          (defaultClass?.value as string),
        optionalClasses: userExists
          ? optionalClasses
          : persistedClassInfo?.optionalClasses,
      },
      { classNamesList: getOptionsList() }
    ),
    value: createFieldValue({
      memberId: member.user.id,
      userStatus: persistedClassInfo?.userStatus || userStatusCodes.RANK_I,
      artifactsList,
      mountList,
      guildId: guild_id,
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
  const status = ACTIVITY_STATUS.JOINED_WAITLIST;
  const createdAt = new Date().getTime();
  const updatedActions = await updateActions(
    {
      discordMemberId: member?.user?.id,
      compositeRaidStatusDate: `${createdAt}#${raidId}#${status}`,
      updates: {
        raidId,
        status,
        raidTitle,
        raidType,
        raidTime,
        currentSection: sectionName,
        requestedSectionName: Category.WAITLIST,
        artifactsList: artifactsList || [],
        mountsList: mountList,
        token,
        primaryClassName,
        optionalClassesNames: optionalClassesNames || [],
        serverId: guild_id,
        channelId: channel_id,
        createdAt: new Date().getTime(),
        embed: JSON.stringify([
          {
            ...message.embeds[0],
            description: messageEmbed.description,
            fields: updatedFieldsList,
          },
        ]),
        hasPendingUpdates: false,
        pendingUpdate: [],
      },
    },
    { documentClient }
  );
  logger.log("info", "updated fields list", {
    updatedFieldsList,
    creatableField,
    updatedActions,
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
