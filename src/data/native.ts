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
    name: "assetPrice",
    label: "Native Asset Price",
    input: true,
    inputPrefix: "$",
  },
  {
    group: "Native Staking Parameters",
    label: "Native Reward Weight",
    secondaryLabel: "Native assets have a weight of 1",
    input: true,
    name: "allianceRewardWeight",
  },
  {
    group: "Native Staking Parameters",
    label: "Reward Weight Percentage",
    secondaryLabel: "% of reward pool distributed to native stakers",
    input: false,
    name: "rewardPoolPercentage",
    format: (value) => (value * 100).toFixed(4) + " %",
  },
  {
    group: "Native Staking Parameters",
    name: "assetStakedInAlliance",
    label: "Total native staked",
    secondaryLabel: "Amount of native asset staked",
    input: true,
  },
  {
    group: "Reward Pool",
    name: "rewardPoolMakeup",
    label: "Native asset in reward pool",
    secondaryLabel: "Amount of native asset in reward pool after 1 year ",
    input: false,
    advanced: true,
  },
  {
    group: "Reward Pool",
    name: "valueOfDenomInRewardPoolExcludingLSD",
    label: "Value of native asset in reward pool",
    secondaryLabel:"Value of native asset in reward pool after 1 year",
    input: false,
    advanced: true,
    format: (value) => currencyFormat(value),
  },
  {
    group: "Reward Pool",
    name: "percentageMakeupOfRewardPoolValue",
    label: "Percentage of reward pool value",
    secondaryLabel:"Percentage of native asset in reward pool",
    input: false,
    advanced: true,
    format: (value) => (value * 100).toFixed(4) + " %",
  },
  {
    group: "Reward Pool Total Value",
    name: "poolTotalValue",
    label: "Total",
    secondaryLabel: "Including Native assets, Alliance assets, and LSD appreciation after 1 year",
    input: false,
    format: (value) => currencyFormat(value),
  },
  {
    group: "Yield",
    name: "stakingRewardValue",
    label: "Estimated rewards for native stakers",
    secondaryLabel: "Value of rewards including Native assets, Alliance assets, and LSD appreciation",
    input: false,
    format: (value) => currencyFormat(value),
  },
  {
    group: "Yield",
    name: "stakingEstimatedPercentage",
    label: "Estimated percentage change over 1 year",
    secondaryLabel: "Reward change including Native assets, Alliance assets, and LSD appreciation",
    input: false,
    format: (value) => (value * 100).toFixed(4) + " %",
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
