import { infoCommand } from "./info";
import { notRecognized } from "./unrecognized";

export const commandActions = {
  'info': infoCommand,
};

export const unrecognizedCommand = notRecognized;
export const recognizedCommands = ['info'];