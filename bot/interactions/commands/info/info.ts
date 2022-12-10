import { APIChatInputApplicationCommandInteractionData } from "discord.js";

export const commandName_info = "info";
export const infoCommand = (data: APIChatInputApplicationCommandInteractionData) => {
  return {
    body: {
      content: `A simple open source bot that helps create raids and answers/interacts with users best it can using an AI model\n
      [Visit Website](https://dasithkuruppu.github.io/uglyBot)\n
      [View Code base on Github](https://github.com/DasithKuruppu/uglyBot)`,
    },
  };
};
