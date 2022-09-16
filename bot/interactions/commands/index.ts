import { infoCommand } from "./info";
import { requestCommand } from "./request";
import { notRecognized } from "./unrecognized";

export const commandActions = {
  info: infoCommand,
  request: requestCommand,
};

export const unrecognizedCommand = notRecognized;
export const recognizedCommands = ["info", "request"];
