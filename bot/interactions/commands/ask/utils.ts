import { botConvosTable } from "../../../../pulumi/persistantStore/tables/botConvos";

export const extractImageUrlArray = (str, lower = false) => {
  const regexp =
    /\b((https?|ftp|file):\/\/|(www|ftp)\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/gi;

  if (typeof str !== "string") {
    return [];
  }

  if (str) {
    let urls = str.match(regexp);
    if (urls) {
      return urls.map((url) => {
        return url.toString();
      });
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export type BotQuestionType = "Question" | "DrawImage" | "Command" | "Unknown";
export const saveBotResponse = async ({
  type = "Question",
  userId,
  userName,
  question,
  botResponse,
  botDiscordResponse,
  documentClient,
  logger,
}: {
  userId: string;
  type: BotQuestionType;
  userName: string;
  question: String;
  botResponse: String;
  botDiscordResponse: String;
  documentClient: any;
  logger: any;
}) => {
  const params = {
    TableName: botConvosTable.name.get(),
    Item: {
      discordMemberId: userId,
      compositeTypeStamp: `${type}#${new Date().toISOString()}`,
      botResponse,
      botDiscordResponse,
      question,
      userName,
      createdAt: new Date().toISOString(),
    },
  };
  try {
    await documentClient.put(params).promise();
    logger.log("info", "saved bot response", { params });
  } catch (error) {
    logger.log("error", "failed to save bot response", { params, error });
  }
};
