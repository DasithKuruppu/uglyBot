import { infoCommand, commandName_info } from "./info/info";
import { requestCommand, commandName_request } from "./request";
import { createCommand, commandName_create } from "./create";
import { notRecognized } from "./unrecognized";

export const commandActions = {
  [commandName_info]: infoCommand,
  [commandName_request]: requestCommand,
  [commandName_create]: createCommand,
};

export const unrecognizedCommand = notRecognized;
export const recognizedCommands = Object.keys(commandActions);
