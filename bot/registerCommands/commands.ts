// https://autocode.com/tools/discord/command-builder/
export const info = {
  name: "info",
  description: "List some info about the bot",
  options: [],
};

export const request_role = {
  name: "request",
  description: "choose a type of request to make",
  options: [
    {
      type: 8,
      name: "role",
      description: "request a role",
    },
  ],
};
