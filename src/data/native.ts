import { currencyFormat } from "./helpers";

export interface NativeInputValues {
  columnName: string;
  denom: string;
  inflationRate: number;
  lsdAnnualEstimate: number;
  totalTokenSupply: number;
  assetPrice: number;
  allianceRewardWeight: number;
  assetStakedInAlliance: number;
}

export interface NativeCalculatedValues {
  rewardPoolOnNativeChain: number;
  rewardPoolPercentage: number;
  rewardPoolMakeup: number;
  valueOfDenomInRewardPoolExcludingLSD: number;
  valueOfDenomInRewardPoolIncludingLSD: number;
  percentageMakeupOfRewardPoolValue: number;
  poolTotalValue: number;
  principalStakeExcludingRewards: number;
  principalStakeIncludingLSD: number;
  stakingRewardValue: number;
  stakingEstimatedPercentage: number;
}

export type NativeFieldKey =
  | keyof NativeInputValues
  | keyof NativeCalculatedValues;

export interface NativeField {
  name: NativeFieldKey;
  label: string;
  secondaryLabel?: string;
  input: boolean;
  group: string;
  advanced?: boolean;
  format?: (value: number) => string;
  inputPrefix?: string;
  inputSuffix?: string;
}

export type NativeFieldMap = {
  [key: string]: NativeField[];
};

export const nativeFields: NativeField[] = [

  {
    group: "Native Chain Data",
    name: "totalTokenSupply",
    label: "Total Supply",
    input: true,
  },
  {
    group: "Native Chain Data",
    name: "inflationRate",
    label: "Inflation Rate",
    input: true,
    inputSuffix: "%",
  },
  {
    group: "Native Chain Data",
    name: "rewardPoolOnNativeChain",
    label: "Reward Pool on Chain",
    secondaryLabel: "Based on inflation",
    input: false,
  },
  {
    group: "Native Chain Data",
    name: "assetPrice",
    label: "Native Asset Price",
    input: true,
    inputPrefix: "$",
  },
  {
    group: "Native Asset Parameters",
    label: "Native Reward Weight",
    secondaryLabel: "Native assets have a weight of 1",
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
    group: "Reward Pool",
    name: "assetStakedInAlliance",
    label: "Staked amount",
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
    format: (value) => currencyFormat(value),
  },
  {
    group: "Reward Pool",
    name: "valueOfDenomInRewardPoolIncludingLSD",
    label: "Value of denom in reward pool",
    secondaryLabel: "After 1 year LSD yield",
    input: false,
    advanced: true,
    format: (value) => currencyFormat(value),
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
    label: "Principal stake amount after 1 year take rate",
    secondaryLabel: "Excluding rewards",
    input: false,
    advanced: true,
  },
  {
    group: "Principal",
    name: "principalStakeIncludingLSD",
    label: "Principal stake value after 1 year take rate",
    secondaryLabel: "Including LSD yield",
    input: false,
    advanced: true,
    format: (value) => currencyFormat(value),
  },
  {
    group: "Yield",
    name: "stakingRewardValue",
    label: "Estimated staking reward value",
    secondaryLabel: "Including LSD yield",
    input: false,
    format: (value) => currencyFormat(value),
  },
  {
    group: "Yield",
    name: "stakingEstimatedPercentage",
    label: "Estimated percentage change over 1 year",
    secondaryLabel: "Including LSD appreciation of Alliance rewards",
    input: false,
    format: (value) => (value * 100).toFixed(4) + " %",
  },
  {
    group: "Reward Pool",
    name: "poolTotalValue",
    label: "Total value of reward pool",
    secondaryLabel: "Including Alliance rewards and LSD appreciation",
    input: false,
    format: (value) => currencyFormat(value),
  },
];

// convert the fields to a map keyed by group for rendering
export const nativeFieldMap: NativeFieldMap = {};

nativeFields.forEach((field) => {
  if (!nativeFieldMap[field.group]) {
    nativeFieldMap[field.group] = [];
  }
  nativeFieldMap[field.group].push(field);
});
