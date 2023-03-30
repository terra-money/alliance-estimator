export interface EstimatorInputValues {
  inflationRate: number;
  lsdApr: number;
  totalTokenSupply: number;
  assetPrice: number;
  allianceRewardWeight: number;
  annualizedTakeRate: number;
}

export interface EstimatorCalculatedValues {
  rewardPoolOnNativeChain: number;
  rewardPoolPercentage: number;
  principalStakeOnTerra: number;
  rewardPoolMakeup: number;
  valueOfDenomInRewardPoolExcludingLSD: number;
  valueOfDenomInRewardPoolIncludingLSD: number;
  percentageMakeupOfRewardPoolValue: number;
  poolTotalValue: number;
  principalStakeExcludingRewards: number;
  principalStakeIncludingLSD: number;
  stakingRewardValue: number;
  stakingAPR: number;
}

export type EstimatorFieldKey =
  | keyof EstimatorInputValues
  | keyof EstimatorCalculatedValues;

export interface EstimatorField {
  name: EstimatorFieldKey;
  label: string;
  input: boolean;
  group: string;
}

export type FieldMap = {
  [key: string]: EstimatorField[];
};

// define fields
export const fields: EstimatorField[] = [
  {
    group: "Chain Data",
    name: "inflationRate",
    label: "Inflation Rate",
    input: true,
  },
  {
    group: "Chain Data",
    name: "lsdApr",
    label: "LSD APR (set to 0 if not an LSD)",
    input: true,
  },
  {
    group: "Chain Data",
    name: "totalTokenSupply",
    label: "Total Token Supply",
    input: true,
  },
  {
    group: "Chain Data",
    name: "rewardPoolOnNativeChain",
    label: "Reward Pool on Native Chain",
    input: false,
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
  },
  {
    group: "Alliance Asset Parameters",
    label: "Annualized Take Rate (for LSDs)",
    input: true,
    name: "annualizedTakeRate",
  },
  {
    group: "Reward Pool",
    name: "principalStakeOnTerra",
    label: "Principal stake on Terra chain",
    input: false,
  },
  {
    group: "Reward Pool",
    name: "rewardPoolMakeup",
    label: "Reward Pool Makeup after 1 year (take rate included)",
    input: false,
  },
  {
    group: "Reward Pool",
    name: "valueOfDenomInRewardPoolExcludingLSD",
    label: "Value of denom in reward pool (excluding LSD yield)",
    input: false,
  },
  {
    group: "Reward Pool",
    name: "valueOfDenomInRewardPoolIncludingLSD",
    label: "Value of denom in reward pool after 1 yr LSD yield",
    input: false,
  },
  {
    group: "Reward Pool",
    name: "percentageMakeupOfRewardPoolValue",
    label: "% makeup of reward pool value",
    input: false,
  },
  {
    group: "Pool Total Value",
    name: "percentageMakeupOfRewardPoolValue",
    label: "(including LSD appreciation)",
    input: false,
  },
  {
    group: "Principal",
    name: "principalStakeExcludingRewards",
    label: "Principal stake (excluding rewards) amount after 1 year take rate",
    input: false,
  },
  {
    group: "Principal",
    name: "principalStakeIncludingLSD",
    label: "Principal stake value (including LSD yield) after 1 year take rate",
    input: false,
  },
  {
    group: "Yield",
    name: "stakingRewardValue",
    label: "Staking reward value (including LSD yield)",
    input: false,
  },
  {
    group: "Yield",
    name: "stakingAPR",
    label: "Staking APR (including LSD appreciation and take rate)",
    input: false,
  },
];

// convert the fields to a map keyed by group for rendering
export const fieldMap: FieldMap = {};

fields.forEach((field) => {
  if (!fieldMap[field.group]) {
    fieldMap[field.group] = [];
  }
  fieldMap[field.group].push(field);
});
