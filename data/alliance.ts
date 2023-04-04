export interface AllianceInputValues {
  lsdApr: number;
  assetPrice: number;
  allianceRewardWeight: number;
  annualizedTakeRate: number;
  principalStakeOnNativeChain: number;
}

export interface AllianceCalculatedValues {
  rewardPoolPercentage: number;
  rewardPoolMakeup: number;
  valueOfDenomInRewardPoolExcludingLSD: number;
  valueOfDenomInRewardPoolIncludingLSD: number;
  percentageMakeupOfRewardPoolValue: number;
  principalStakeExcludingRewards: number;
  principalStakeIncludingLSD: number;
  stakingRewardValue: number;
  stakingAPR: number;
  takeRateInterval: number;
  takeRate: number;
}

export type AllianceFieldKey =
  | keyof AllianceInputValues
  | keyof AllianceCalculatedValues;

export interface AllianceField {
  name: AllianceFieldKey;
  label: string;
  secondaryLabel?: string;
  input: boolean;
  group: string;
  advanced?: boolean;
  format?: (value: number) => string;
  parse?: (value: string) => string;
}

export type AllianceFieldMap = Record<string, AllianceField[]>;

export const allianceFields: AllianceField[] = [
  {
    group: "Chain Data",
    name: "lsdApr",
    label: "Annual Estimated LSD Growth Rate",
    secondaryLabel: "Set to 0 if not an LSD",
    input: true,
  },
  {
    group: "Chain Data",
    name: "assetPrice",
    label: "Asset Price",
    input: true,
  },
  {
    group: "Alliance Asset Parameters",
    label: "Alliance Reward Weight",
    input: true,
    name: "allianceRewardWeight",
  },
  {
    group: "Alliance Asset Parameters",
    label: "Reward Pool Percentage",
    input: false,
    name: "rewardPoolPercentage",
    format: (value) => (value * 100).toFixed(4) + " %",
  },
  {
    group: "Alliance Asset Parameters",
    label: "Annualized Take Rate (for LSDs)",
    input: true,
    name: "annualizedTakeRate",
  },
  {
    group: "Alliance Asset Parameters",
    label: "Take Rate Interval",
    secondaryLabel: "Minutes",
    input: false,
    name: "takeRateInterval",
  },
  {
    group: "Alliance Asset Parameters",
    label: "Take Rate",
    secondaryLabel: "Module Parameter",
    input: false,
    name: "takeRate",
    format: (value) => value.toPrecision(11),
  },
  {
    group: "Reward Pool",
    name: "principalStakeOnNativeChain",
    label: "Principal stake on Native chain",
    input: true,
  },
  {
    group: "Reward Pool",
    name: "rewardPoolMakeup",
    label: "Reward Pool Makeup after 1 year",
    secondaryLabel: "Take rate included",
    input: false,
    advanced: true,
  },
  {
    group: "Reward Pool",
    name: "valueOfDenomInRewardPoolExcludingLSD",
    label: "Value of denom in reward pool",
    secondaryLabel: "Excluding LSD yield",
    input: false,
    advanced: true,
  },
  {
    group: "Reward Pool",
    name: "valueOfDenomInRewardPoolIncludingLSD",
    label: "Value of denom in reward pool after 1 yr LSD yield",
    input: false,
    advanced: true,
  },
  {
    group: "Reward Pool",
    name: "percentageMakeupOfRewardPoolValue",
    label: "% makeup of reward pool value",
    input: false,
    advanced: true,
    format: (value) => (value * 100).toFixed(4) + " %",
  },
  {
    group: "Principal",
    name: "principalStakeExcludingRewards",
    label: "Principal stake amount - 1 year take rate",
    secondaryLabel: "Excluding rewards",
    input: false,
    advanced: true,
  },
  {
    group: "Principal",
    name: "principalStakeIncludingLSD",
    label: "Principal stake value - 1 year take rate",
    secondaryLabel: "Including LSD yield",
    input: false,
    advanced: true,
  },
  {
    group: "Yield",
    name: "stakingRewardValue",
    label: "Staking reward value",
    secondaryLabel: "Including LSD yield",
    input: false,
  },
  {
    group: "Yield",
    name: "stakingAPR",
    label: "Staking APR",
    secondaryLabel: "Including LSD appreciation and take rate",
    input: false,
    format: (value) => (value * 100).toFixed(4) + " %",
  },
];

// convert the fields to a map keyed by group for rendering
export const allianceFieldMap: AllianceFieldMap = {};

allianceFields.forEach((field) => {
  if (!allianceFieldMap[field.group]) {
    allianceFieldMap[field.group] = [];
  }
  allianceFieldMap[field.group].push(field);
});
