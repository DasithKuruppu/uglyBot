import {
  Category,
  ISectionSeperation,
} from "../../../interactions/messageComponents/utils/categorizeEmbedFields/categorizeEmbedFields";

export const tenPersonSeperation: ISectionSeperation = {
  [Category.DPS_TITLE]: { start: 0, end: 1 },
  [Category.DPS]: { start: 1, end: 7 },
  [Category.TANK_TITLE]: { start: 7, end: 8 },
  [Category.TANK]: { start: 8, end: 10 },
  [Category.HEALER_TITLE]: { start: 10, end: 11 },
  [Category.HEALER]: { start: 11, end: 13 },
  [Category.WAITLIST_TITLE]: { start: 13, end: 14 },
  [Category.WAITLIST]: { start: 14, end: 20 },
};

export const tenPersonSoloTankSeperation: ISectionSeperation = {
  [Category.DPS_TITLE]: { start: 0, end: 1 },
  [Category.DPS]: { start: 1, end: 8 },
  [Category.TANK_TITLE]: { start: 8, end: 9 },
  [Category.TANK]: { start: 9, end: 10 },
  [Category.HEALER_TITLE]: { start: 10, end: 11 },
  [Category.HEALER]: { start: 11, end: 13 },
  [Category.WAITLIST_TITLE]: { start: 13, end: 14 },
  [Category.WAITLIST]: { start: 14, end: 20 },
};

export const tenPersonSoloHealSeperation: ISectionSeperation = {
  [Category.DPS_TITLE]: { start: 0, end: 1 },
  [Category.DPS]: { start: 1, end: 8 },
  [Category.TANK_TITLE]: { start: 8, end: 9 },
  [Category.TANK]: { start: 9, end: 11 },
  [Category.HEALER_TITLE]: { start: 11, end: 12 },
  [Category.HEALER]: { start: 12, end: 13 },
  [Category.WAITLIST_TITLE]: { start: 13, end: 14 },
  [Category.WAITLIST]: { start: 14, end: 20 },
};

export const tenPersonSoloHealTankSeperation: ISectionSeperation = {
  [Category.DPS_TITLE]: { start: 0, end: 1 },
  [Category.DPS]: { start: 1, end: 9 },
  [Category.TANK_TITLE]: { start: 9, end: 10 },
  [Category.TANK]: { start: 10, end: 11 },
  [Category.HEALER_TITLE]: { start: 11, end: 12 },
  [Category.HEALER]: { start: 12, end: 13 },
  [Category.WAITLIST_TITLE]: { start: 13, end: 14 },
  [Category.WAITLIST]: { start: 14, end: 20 },
};

export const tenPersonThreeHealTwoTankSeperation: ISectionSeperation = {
  [Category.DPS_TITLE]: { start: 0, end: 1 },
  [Category.DPS]: { start: 1, end: 6 },
  [Category.TANK_TITLE]: { start: 6, end: 7 },
  [Category.TANK]: { start: 7, end: 9 },
  [Category.HEALER_TITLE]: { start: 9, end: 10 },
  [Category.HEALER]: { start: 10, end: 13 },
  [Category.WAITLIST_TITLE]: { start: 13, end: 14 },
  [Category.WAITLIST]: { start: 14, end: 20 },
};

export const tenPersonThreeTankTwoHealSeperation: ISectionSeperation = {
  [Category.DPS_TITLE]: { start: 0, end: 1 },
  [Category.DPS]: { start: 1, end: 6 },
  [Category.TANK_TITLE]: { start: 6, end: 7 },
  [Category.TANK]: { start: 7, end: 10 },
  [Category.HEALER_TITLE]: { start: 10, end: 11 },
  [Category.HEALER]: { start: 11, end: 13 },
  [Category.WAITLIST_TITLE]: { start: 13, end: 14 },
  [Category.WAITLIST]: { start: 14, end: 20 },
};

export const tenPersonThreeHealOneTankSeperation: ISectionSeperation = {
  [Category.DPS_TITLE]: { start: 0, end: 1 },
  [Category.DPS]: { start: 1, end: 7 },
  [Category.TANK_TITLE]: { start: 7, end: 8 },
  [Category.TANK]: { start: 8, end: 9 },
  [Category.HEALER_TITLE]: { start: 9, end: 10 },
  [Category.HEALER]: { start: 10, end: 13 },
  [Category.WAITLIST_TITLE]: { start: 13, end: 14 },
  [Category.WAITLIST]: { start: 14, end: 20 },
};

export const fivePersonSeperation: ISectionSeperation = {
  [Category.DPS_TITLE]: { start: 0, end: 1 },
  [Category.DPS]: { start: 1, end: 4 },
  [Category.TANK_TITLE]: { start: 4, end: 5 },
  [Category.TANK]: { start: 5, end: 6 },
  [Category.HEALER_TITLE]: { start: 6, end: 7 },
  [Category.HEALER]: { start: 7, end: 8 },
  [Category.WAITLIST_TITLE]: { start: 8, end: 9 },
  [Category.WAITLIST]: { start: 9, end: 13 },
};

export const raidConfigs = {
  "1U6U1U2U1U2U1U3": tenPersonSeperation,
  "1U7U1U1U1U2U1U3": tenPersonSoloTankSeperation,
  "1U7U1U2U1U1U1U3": tenPersonSoloHealSeperation,
  "1U8U1U1U1U1U1U3": tenPersonSoloHealTankSeperation,
  "1U3U1U1U1U1U1U3": fivePersonSeperation,
  // compatible with previous configs
  "1U6U1U2U1U2U1U6": tenPersonSeperation,
  "1U7U1U1U1U2U1U6": tenPersonSoloTankSeperation,
  "1U7U1U2U1U1U1U6": tenPersonSoloHealSeperation,
  "1U8U1U1U1U1U1U6": tenPersonSoloHealTankSeperation,
  "1U5U1U2U1U3U1U6": tenPersonThreeHealTwoTankSeperation,
  "1U5U1U3U1U2U1U6": tenPersonThreeTankTwoHealSeperation,
  "1U6U1U1U1U3U1U6": tenPersonThreeHealOneTankSeperation,
};
