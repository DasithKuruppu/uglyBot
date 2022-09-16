import { APIChatInputApplicationCommandInteractionData } from "discord.js";

export const infoCommand = (data: APIChatInputApplicationCommandInteractionData) => {
  return {
    body: {
      content: "A simple opensource bot still under development... [track progress](https://github.com/DasithKuruppu/uglyBot).",
    },
  };
};
