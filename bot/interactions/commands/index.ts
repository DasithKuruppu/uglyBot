import { infoCommand, commandName_info } from "./info/info";
import { requestCommand, commandName_request } from "./request";
import { createCommand, commandName_create } from "./create";
import { commandName_remove, removeCommand } from "./remove";
import { notRecognized } from "./unrecognized";

export const commandActions = {
  [commandName_info]: infoCommand,
  [commandName_request]: requestCommand,
  [commandName_create]: createCommand,
  [commandName_remove]: removeCommand,
};

export const unrecognizedCommand = notRecognized;
export const recognizedCommands = Object.keys(commandActions);
