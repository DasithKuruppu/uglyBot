import { APIChatInputApplicationCommandInteractionData } from "discord.js";

export const commandName_info = "info";
export const infoCommand = (data: APIChatInputApplicationCommandInteractionData) => {
  return {
    body: {
      content: `A simple opensource bot still under development... \n
      [Visit Website](https://dasithkuruppu.github.io/uglyBot)\n
      [View Code base on Github](https://github.com/DasithKuruppu/uglyBot)`,
    },
  };
};
