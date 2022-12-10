import {
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteractionData,
  RESTGetAPIChannelMessageResult,
  RESTGetAPIChannelMessagesResult,
  Routes,
} from "discord.js";
import keywordExtractor from "keyword-extractor";
import { convertToDiscordDate } from "../../messageComponents/utils/date/dateToDiscordTimeStamp";
import { getRaid } from "../../messageComponents/utils/storeOps/fetchData";
import { updateRaid } from "../../messageComponents/utils/storeOps/updateData";
export const commandName_ask = "ask";

export const askCommand = async (
  data: APIChatInputApplicationCommandInteractionData,
  factoryInits: any
) => {
  const { rest, logger, openAi, documentClient, interactionConfig } =
    factoryInits;
  const [{ name: subCommandName, value: messageValue = [] }] =
    data.options as any[];
  const message: string = messageValue;
  const userId = interactionConfig.member?.user?.id;
  const user = interactionConfig.member?.user;
  const keywords = keywordExtractor.extract(message, {
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });

  const sanitizedDrawingKeywords = keywordExtractor.extract(message, {
    remove_digits: false,
    return_changed_case: false,
    remove_duplicates: true,
    return_chained_words: true,
  });
  const commandUpdateTimeTextContext = `Convert this text to a programmatic command:\n
  Example: Update the date and time of raid IfPE2ZNEjd to Tomorrow 9:30 PM \n\n
  output:{"update_raid": "IfPE2ZNEjd", "date_time": "Tomorrow 9:30 PM"}`;
  const updateRaidTimeIdentifiers = ["update", "raid", "date", "time"];
  const requiresUpdateRaidTime =
    updateRaidTimeIdentifiers.filter((identifier) => {
      return keywords.includes(identifier);
    }).length >= 2;

  const drawingIdentifiers = ["draw", "drawing", "painting"];
  const requiresDrawing =
    keywords.filter((keyword) => {
      return (
        drawingIdentifiers.includes(keyword) &&
        !["find", "search"].includes(keyword)
      );
    }).length > 0;

  logger.log("info", `identifiers`, {
    drawingIdentifiers,
    sanitizedDrawingKeywords,
    keywords,
    requiresDrawing,
    requiresUpdateRaidTime,
  });

  if (requiresUpdateRaidTime) {
    const updateRaidTimeResponse = await openAi.createCompletion({
      model: "text-davinci-003",
      prompt: `${commandUpdateTimeTextContext}\n\n ${message.trim()}`,
      temperature: 0,
      max_tokens: 92,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0,
    });
    const commandTextRaidTime = updateRaidTimeResponse.data?.choices?.[0].text;
    const [extractJSONTextCommand] = commandTextRaidTime.match(/{.+}/gi);
    logger.log("info", "pre update Raid", { commandTextRaidTime });
    const { update_raid: raidId, date_time } = JSON.parse(
      extractJSONTextCommand.trim()
    );
    const creatorId = interactionConfig.member?.user?.id;
    const raidRecord = await getRaid({ raidId }, { documentClient });
    logger.log("info", { raidRecord, raidId });
    const raidChannelId = raidRecord?.channelId;
    const raidMessageId = raidRecord?.messageId;
    if (!raidChannelId || !raidMessageId) {
      return {
        body: {
          content: `<@${userId}> asked : ${message} \n>>> I looked up the records and no record with raid Id - ${raidId} exists for this user.`,
          allowed_mentions: {
            parse: [],
          },
        },
      };
    }
    if (raidRecord.creatorId !== creatorId) {
      return {
        body: {
          content: `<@${userId}> asked : ${message} \n>>> I looked up the records with raid Id - ${raidId} and it seems like you are not the creator of the raid so I will not be able to change this for you unless you are the creator of this raid.`,
          allowed_mentions: {
            parse: [],
          },
        },
      };
    }
    const foundRaidMessage = (await rest.get(
      (Routes as any).channelMessage(raidChannelId, raidMessageId)
    )) as RESTGetAPIChannelMessageResult;
    if (!foundRaidMessage) {
      return {
        body: {
          content: `<@${userId}> asked : ${message} \n>>> I Could not find the discord message accociated with this raid Id.`,
          allowed_mentions: {
            parse: [],
          },
        },
      };
    }
    const { content, embeds, components } = foundRaidMessage;
    const processedDate = (date_time as string).replace("UTC","GMT");
    const requestedTimeRelative = convertToDiscordDate(processedDate, {
      relative: true,
    });
    const requestedDateTime = convertToDiscordDate(processedDate, {
      relative: false,
    });

    const allPreviousPendingUpdates: any[] = JSON.parse(
      raidRecord?.pendingUpdates || "[]"
    );
    const [previousPendingUpdate] = allPreviousPendingUpdates.slice(-1);
    const [currentEmbed] = raidRecord?.hasPendingUpdates
      ? previousPendingUpdate?.embeds
      : embeds;
    const updatedContent = content.replace(/<t:.+:F>/gi, requestedDateTime);
    const currentUpdatedEmbedDescription = currentEmbed.description
      .replace(/<t:.+:F>/gi, requestedDateTime)
      .replace(/<t:.+:R>/gi, requestedTimeRelative);
    const updatedRecordData = updateRaid(
      {
        raidId: raidRecord.raidId,
        createdAt: raidRecord.createdAt,
        updates: {
          eventDiscordDateTime: requestedDateTime,
          updatedAt: Date.now(),
          hasPendingUpdates: true,
          pendingUpdates: JSON.stringify([
            ...allPreviousPendingUpdates,
            {
              content: updatedContent,
              components,
              embeds: [
                {
                  ...currentEmbed,
                  description: currentUpdatedEmbedDescription,
                },
              ],
            },
          ]),
        },
      },
      { documentClient }
    );
    logger.log("info", "update Raid", {
      updatedRecordData,
      commandTextRaidTime,
      currentUpdatedEmbedDescription,
      updatedContent
    });
    return {
      body: {
        content: `<@${userId}> asked : ${message} \n>>> I have queued in an update for the date/time ${requestedDateTime} change you requested. You need to press \`confirm\` on the relavent embed for the changes to be reflected !`,
        allowed_mentions: {
          parse: [],
        },
      },
    };
  }
  if (requiresDrawing) {
    const prompt = sanitizedDrawingKeywords.join(" ");
    try {
      const imageResponse = await openAi.createImage({
        prompt,
        n: 1,
        size: "512x512",
      });

      const image_url: string = imageResponse.data?.data?.[0]?.url;
      logger.log("info", `response`, {
        imageResponse,
        message,
        keywords,
        sanitizedDrawingKeywords,
      });
      return {
        body: {
          content: `<@${userId}> asked : ${message} \n>>> \n`,
          embeds: [{ image: { url: image_url } }],
        },
      };
    } catch (err) {
      return {
        body: {
          content: `<@${userId}> asked : ${message} \n>>> I don't like to draw that sorry.`,
        },
      };
    }
  }
  const previosMessages = (await rest.get(
    (Routes as any).channelMessages(interactionConfig.channel_id)
  )) as RESTGetAPIChannelMessagesResult;
  const messageContext = previosMessages
    .map(({ author, content, interaction, mentions, embeds }) => {
      const authorIsMe =
        author.bot && ["sampleBot", "uglyBot"].includes(author.username);
      return {
        userName: author?.username,
        authorIsMe,
        content,
        isInteraction: !!interaction?.name,
        isInteractionAsk: interaction?.name === "ask",
        interactionUser: interaction?.user?.username,
        isDrawing: authorIsMe && embeds && embeds.length,
      };
    })
    .filter(({ content, isInteraction, isInteractionAsk }) => {
      return (
        content != "Please wait while I make some 🥞 pancakes..." &&
        isInteraction &&
        isInteractionAsk
      );
    })
    .map(
      ({
        userName,
        authorIsMe,
        content,
        isInteractionAsk,
        interactionUser,
        isDrawing,
      }) => {
        if (!isInteractionAsk) {
          return [`${userName}: ${content}`];
        }
        const [askedInteractionQuestion, answer = ""] = content
          .replace(/(<@\d+>\sasked\s:)+/gi, "")
          .replace(/\n+/gi, " ")
          .split(">>>");
        if (isDrawing) {
          return [];
        }
        return [
          `${userName}:${
            answer.length > 320 ? answer.slice(0, 320) + "..." : answer
          }`,
          `${interactionUser}:${askedInteractionQuestion}`,
        ];
      }
    )
    .slice(0, 3)
    .flatMap((conversation) => conversation)
    .reverse()
    .concat(`${user.username}:${message}`)
    .concat(`uglyBot:`);
  logger.log("info", "user", { user });
  const response = await openAi.createCompletion({
    model: "text-davinci-003",
    prompt: messageContext.join("\n"),
    temperature: 0.5,
    max_tokens: 240,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  });
  logger.log("info", `response`, { response, message });
  return {
    body: {
      content: `<@${userId}> asked : ${message} \n>>> ${response.data?.choices?.[0].text}`,
    },
  };
};
