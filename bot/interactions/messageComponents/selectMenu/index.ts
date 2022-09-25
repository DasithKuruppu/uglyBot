import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { IfactoryInitializations } from "../typeDefinitions/event";
import { raidArtifactSelectId, raidArtifactSelect } from "./raidSelectMenu/artifactSelect";
import { raidClassSelectId, raidClassSelect} from "./raidSelectMenu/classSelect"

export const selectMenusInteractions = {
    [raidArtifactSelectId]:  raidArtifactSelect,
    [raidClassSelectId]: raidClassSelect
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
