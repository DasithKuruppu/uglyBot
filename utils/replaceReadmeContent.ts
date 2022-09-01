import replace from "replace-in-file";

export const coverageRegexString = "!\\[\\]\\(https://img\\.shields\\..+s.+\\)";
export const defaultCoverageReplaceOptions = {
  files: "readme.md",
  from: new RegExp(coverageRegexString, "igm"),
  to: "$coverage$ $statements$ $branches$ $functions$ $lines$",
  countMatches: true,
};

export const coverageReplace = ({ options = defaultCoverageReplaceOptions } = {}) => {
   return replace.sync(options);
};
