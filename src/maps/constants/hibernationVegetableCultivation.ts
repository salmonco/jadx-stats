import { ButtonGroupSelectorOption } from "~/features/visualization/components/common/ButtonGroupSelector";

export const TARGET_YEAR = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

export const DEFAULT_TARGET_YEAR = TARGET_YEAR[TARGET_YEAR.length - 1];

const CROP_TYPE = {
  월동무: "월동무",
  양배추: "양배추",
  당근: "당근",
  마늘: "마늘",
  양파: "양파",
  브로콜리: "브로콜리",
  비트: "비트",
  콜라비: "콜라비",
  적채: "적채",
  쪽파: "쪽파",
  월동배추: "월동배추",
  방울다다기양배추: "방울다다기양배추",
} as const;

export const CROP_LEGEND_ITEMS: ButtonGroupSelectorOption[] = Object.entries(CROP_TYPE).map(([value, label]) => ({ value, label }));

export type CropType = keyof typeof CROP_TYPE;

export const DEFAULT_CROP = "월동무";
