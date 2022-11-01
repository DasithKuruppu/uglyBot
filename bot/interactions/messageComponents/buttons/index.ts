import { APIMessageSelectMenuInteractionData } from "discord-api-types/payloads/v10/interactions";
import { IfactoryInitializations } from "../typeDefinitions/event";
import { confirmButtonInteract } from "./raidButton/confirm";
import { defaultRaidButtonInfo } from "../../../embeds/templates/neverwinter/raid";
import { waitlistButtonInteract } from "./raidButton/waitlist";
import { wontJoinButtonInteract } from "./raidButton/wontJoin";

export const buttonInteractions = {
  [defaultRaidButtonInfo.buttons.joinConfirmButton.id]: confirmButtonInteract,
  [defaultRaidButtonInfo.buttons.joinWaitlistButton.id]: waitlistButtonInteract,
  [defaultRaidButtonInfo.buttons.wontJoinButton.id]: wontJoinButtonInteract,
};

export const recognizedButtonInteractionComponentIds =
  Object.keys(buttonInteractions);

export const raidButtonInteractions = async (
  data: APIMessageSelectMenuInteractionData,
  factoryInits: IfactoryInitializations
) => {
  const component_custom_id = data.custom_id;
  const { logger } = factoryInits;
  logger.log("info", "raidButtonInteractions", data);
  return await buttonInteractions[component_custom_id](data, factoryInits);
};
