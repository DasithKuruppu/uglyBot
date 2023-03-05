import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { IfactoryInitializations } from "../../typeDefinitions/event";
import { raidArtifactSelectId, raidArtifactSelect } from "./raidSelectMenu/artifactSelect";
import { raidClassSelectId, raidClassSelect} from "./raidSelectMenu/classSelect";
import { profileStatusVoteId, profileStatusVote } from "./profileSelectMenu/statusVoteSelect";
import { serverProfileTZSelect, timezoneSelect } from "./serverProfileSelectMenu/serverProfileSelectTimezone"
import { serverProfileRoleSelect, serverProfileRoles} from "./serverProfileSelectMenu/selectUserRoles";
import { profileMountSelect, profileMountsSelectId } from "./profileSelectMenu/selectMounts";

export const selectMenusInteractions = {
    [raidArtifactSelectId]:  raidArtifactSelect,
    [raidClassSelectId]: raidClassSelect,
    [profileStatusVoteId]: profileStatusVote,
    [serverProfileTZSelect]: timezoneSelect,
    [profileMountsSelectId]: profileMountSelect,
    [serverProfileRoles]: serverProfileRoleSelect
};

export const recognizedMenuInteractionComponentIds = Object.keys(
  selectMenusInteractions
);

export const raidSelectMenusInteractions = async(
  data : APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations ) => {
  const component_custom_id = data.custom_id;

  return await selectMenusInteractions[component_custom_id](data, factoryInits);
};
