import {
  ArtifactsList,
  newArtifactsList,
  ArtifactsNames,
} from "../../../../embeds/templates/artifactsList";
import { MountsList } from "../../../../embeds/templates/mountsList";


export const displayMountsAsEmoji = (
  mountShortNamesList: string[] = [],
  { seperator = /[,|\s]+/ } = {}
) => {
  return mountShortNamesList.map((mountName) => {
    const foundMount = MountsList.find(
      ({ shortName }) => shortName === mountName
    );
    const { emoji: { id = "unknown", name = "unknown" } = {} } =
      foundMount || {};
    return foundMount ? `<:${name}:${id}>` : "❔";
  });
};
export const displayArtifactAsEmoji = (
  artifactShortNamesList: string[] = [],
  { seperator = /[,|\s]+/ } = {}
) => {
  return artifactShortNamesList.map((artifactName) => {
    const foundArtifact = newArtifactsList.find(
      ({ shortName }) => shortName === artifactName
    );
    const { emoji: { id = "unknown", name = "unknown" } = {} } =
      foundArtifact || {};
    return foundArtifact ? `<:${name}:${id}>` : "❔";
  });
};

export const extractShortArtifactNames = (emojiList) => {
  return (emojiList || []).map((emoji) => {
    const myRegexp = /<:.+:(.+)>/gi;
    const [capturedText = "unknown", id = "unknown"] =
      myRegexp.exec(emoji) || [];
    return (
      ArtifactsList.find(({ emoji }) => {
        return emoji.id === id;
      })?.shortName ||  newArtifactsList.find(({ emoji }) => {
        return emoji.id === id;
      })?.shortName || "unknown"
    );
  });
};


export const extractShortMountNames = (emojiList) => {
  return (emojiList || []).map((emoji) => {
    const myRegexp = /<:.+:(.+)>/gi;
    const [capturedText = "unknown", id = "unknown"] =
      myRegexp.exec(emoji) || [];
    return (
      MountsList.find(({ emoji }) => {
        return emoji.id === id;
      })?.shortName ||  newArtifactsList.find(({ emoji }) => {
        return emoji.id === id;
      })?.shortName || "unknown"
    );
  });
};

export const isEmoji = (emojiText) => {
  return emojiText.includes("<") && emojiText.includes(">");
};
