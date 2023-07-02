import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { EmbedField, Routes } from "discord.js";
import { raidConfigs } from "../../../../embeds/templates/neverwinter/config";
import { IfactoryInitializations } from "../../../typeDefinitions/event";
import { membersTable } from "../../../../../pulumi/persistantStore/tables/members";
import { setUpdateValues } from "../../../../store/utils";
import {
  Category,
  determineActions,
  getEmbedFieldsSeperatedSections,
  getExistingMemberRecordDetails,
} from "../../utils/categorizeEmbedFields/categorizeEmbedFields";
import {
  createFieldName,
  createFieldValue,
  defaultJoinStatus,
} from "../../utils/helper/embedFieldAttribute";
import {
  createRaidContent,
  determineRaidTemplateType,
  getRaidTime,
  getRaidTitle,
} from "../../utils/helper/raid";
import { createEmbedArtifactSortContent } from "../../utils/helper/artifactsSorter";
import {
  defaultClassName,
  getOptionsList,
  NeverwinterClassesMap,
} from "../../../../embeds/templates/neverwinter/classesList";
import { getLastUsersClass } from "../../utils/storeOps/fetchData";
import {
  ACTIVITY_STATUS,
  updateActions,
} from "../../utils/storeOps/memberActions";
import { userStatusCodes } from "../../utils/storeOps/userStatus";
export const raidMountSelectId = "select_Mount";
export const raidMounttSelect = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const {
    logger,
    rest,
    documentClient,
    interactionConfig: {
      application_id,
      token,
      channel_id,
      guild_id,
      member,
      message,
    },
  } = factoryInits;
  const currentFields = message.embeds[0].fields || [];
  const { raidTitle, raidType } = getRaidTitle(message.embeds[0]?.title);
  const messageContent = message?.content;
  const messageEmbed = message.embeds[0];
  const [unprocessedRaidId, unprocessedRaidTime] =
    messageEmbed.description?.split("\n") as string[];
  const raidId = unprocessedRaidId.replace("🆔 ", "");
  const raidTime = getRaidTime(unprocessedRaidTime.replace("⏱️ ", ""));
  const selectedMountsList = data.values;
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
    considerDefault: true,
  });
  const defaultClassType =
    (new Map(NeverwinterClassesMap).get(
      persistedClassInfo?.className || defaultClass?.value
    )?.type as Category) || Category.WAITLIST;
  const [
    {
      userExists = false,
      userRecord = undefined,
      userStatus = defaultJoinStatus,
      sectionName = defaultClassType,
      userArtifacts = persistedClassInfo?.artifactsList,
      optionalClasses = [],
      userIndex = 0,
    } = {},
  ] = getExistingMemberRecordDetails(seperatedSections, member.user.id);
  const existingUserClassType =
    userRecord?.name || (defaultClass?.value as string);
  const primaryClassName =
    (userRecord as EmbedField)?.name ||
    persistedClassInfo?.className ||
    (defaultClass?.value as string);
  const optionalClassesNames = userExists
    ? optionalClasses
    : persistedClassInfo?.optionalClasses;
  const mountsList = selectedMountsList || persistedClassInfo?.mountsList || [];

  const creatableField: EmbedField = {
    name: createFieldName(
      {
        fieldName:
          (userRecord as EmbedField)?.name ||
          persistedClassInfo?.className ||
          (defaultClass?.value as string),
        optionalClasses,
      },
      { classNamesList: getOptionsList() }
    ),
    value: createFieldValue({
      memberId: member.user.id,
      userStatus: persistedClassInfo?.userStatus || userStatusCodes.RANK_I,
      artifactsList: userArtifacts,
      mountList: mountsList,
      guildId: guild_id,
    }),
    inline: true,
  };
  const { updatedFieldsList, updatedSections } = determineActions(
    seperatedSections,
    {
      memberId: member.user.id,
      requestedUserSection: sectionName as Category,
      userField: creatableField,
      factoryInits,
      defaultSeperation: sectionSeperation,
    }
  );
  const updateValues = setUpdateValues({
    artifactsList: userArtifacts || [],
    mountsList,
    serverId: guild_id,
    updatedAt: Date.now(),
    optionalClasses,
  });
  try {
    await documentClient
      .update({
        TableName: membersTable.name.get(),
        Key: {
          discordMemberId: member.user.id,
          className: existingUserClassType,
        },
        ReturnValues: "UPDATED_NEW",
        UpdateExpression: updateValues.updateExpression,
        ExpressionAttributeNames: updateValues.updateExpressionAttributeNames,
        ExpressionAttributeValues: updateValues.updateExpressionAttributeValues,
      })
      .promise();
  } catch (error) {
    logger.log(
      "error",
      (error as any).message || "error occured updating record",
      error
    );
  }

  const status = ACTIVITY_STATUS.JOINED_MOUNT_SELCT;
  const createdAt = new Date().getTime();
  const updatedActionsRecord = await updateActions(
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
        requestedSectionName: sectionName,
        artifactsList: userArtifacts || [],
        mountsList,
        token,
        primaryClassName,
        optionalClassesNames: optionalClassesNames || [],
        serverId: guild_id,
        channelId: channel_id,
        createdAt,
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
  logger.log("info", "values to update", {
    userExists,
    userStatus,
    defaultJoinStatus,
    userRecord,
    guild_id,
    userArtifacts,
    creatableField,
    updateValues,
    updatedFieldsList,
  });
  return {
    body: {
      embeds: [{ ...message.embeds[0], fields: updatedFieldsList }],
      content: createRaidContent(message.content, {
        userActionText: `<@${member.user.id}> updated ${mountsList.length} mounts`,
        userArtifacts: createEmbedArtifactSortContent(
          updatedSections,
          raidTitle
        ),
      }),
    },
  };
};
