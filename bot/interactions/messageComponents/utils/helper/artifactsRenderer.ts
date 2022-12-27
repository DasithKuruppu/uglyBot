import {
  ArtifactsList,
  ArtifactsNames,
} from "../../../../embeds/templates/artifactsList";

export const displayArtifactAsEmoji = (
  artifactShortNamesList: string[] = [],
  { seperator = /[,|\s]+/ } = {}
) => {
  return artifactShortNamesList.map((artifactName) => {
    const foundArtifact = ArtifactsList.find(
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
      })?.shortName || "unknown"
    );
  });
};

export const isEmoji = (emojiText) => {
  return emojiText.includes("<") && emojiText.includes(">");
};
