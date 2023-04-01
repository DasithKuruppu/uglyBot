import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { IfactoryInitializations } from "../../typeDefinitions/event";
import { raidArtifactSelectId, raidArtifactSelect } from "./raidSelectMenu/artifactSelect";
import { raidClassSelectId, raidClassSelect} from "./raidSelectMenu/classSelect";
import { raidMountSelectId, raidMounttSelect } from "./raidSelectMenu/mountSelect";
import { profileStatusVoteId, profileStatusVote } from "./profileSelectMenu/statusVoteSelect";
import { serverProfileTZSelect, timezoneSelect } from "./serverProfileSelectMenu/serverProfileSelectTimezone"
import { serverProfileRoleSelect, serverProfileRoles} from "./serverProfileSelectMenu/selectUserRoles";
import { profileTimeZoneSelect, profileTimezoneSelectId } from "./profileSelectMenu/selectTimeZone";
import { profilePrefferredRaidsId, profilePrefferredRaidsSelect} from "./profileSelectMenu/selectPreferredRaids";
import { profilePrefferredRaidTypesId, profilePrefferredRaidTypesSelect } from "./profileSelectMenu/selectPrefferedRaidTypes";

export const selectMenusInteractions = {
    [raidArtifactSelectId]:  raidArtifactSelect,
    [raidClassSelectId]: raidClassSelect,
    [raidMountSelectId]: raidMounttSelect,
    [profileStatusVoteId]: profileStatusVote,
    [serverProfileTZSelect]: timezoneSelect,
    [profileTimezoneSelectId]: profileTimeZoneSelect,
    [serverProfileRoles]: serverProfileRoleSelect,
    [profilePrefferredRaidsId]: profilePrefferredRaidsSelect,
    [profilePrefferredRaidTypesId]: profilePrefferredRaidTypesSelect
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
