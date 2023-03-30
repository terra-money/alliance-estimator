import { useState, useMemo } from "react";
import styles from "@/styles/Estimator.module.css";

interface EstimatorInputValues {
  inflationRate: number;
  lsdApr: number;
  totalTokenSupply: number;
  assetPrice: number;
  allianceRewardWeight: number;
  annualizedTakeRate: number;
}
interface EstimatorCalculatedValues {
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

interface EstimatorField {
  name: keyof EstimatorInputValues | keyof EstimatorCalculatedValues;
  label: string;
  input: boolean;
  group: string;
}

type FieldMap = {
  [key: string]: EstimatorField[];
};

export function Estimator() {
  const [values, setValues] = useState<EstimatorInputValues>({
    inflationRate: 0.07,
    lsdApr: 0,
    totalTokenSupply: 1073271122,
    assetPrice: 1.3,
    allianceRewardWeight: 1,
    annualizedTakeRate: 0,
  });

  // cache derived values
  const rewardPoolOnNativeChain = useMemo(
    () => values.inflationRate * values.totalTokenSupply,
    [values.inflationRate, values.totalTokenSupply]
  );
  // TODO: create use context hook to get pool percentage from all assets.
  const rewardPoolPercentage = 0.9606;
  const principalStakeOnTerra = useMemo(
    () => values.totalTokenSupply,
    [values.totalTokenSupply]
  );
  const rewardPoolMakeup = useMemo(
    () => values.totalTokenSupply * values.inflationRate,
    [values.totalTokenSupply, values.inflationRate]
  );
  const valueOfDenomInRewardPoolExcludingLSD = useMemo(
    () => rewardPoolMakeup * values.assetPrice,
    [rewardPoolMakeup, values.assetPrice]
  );

  const valueOfDenomInRewardPoolIncludingLSD = useMemo(
    () =>
      valueOfDenomInRewardPoolExcludingLSD +
      rewardPoolMakeup * values.lsdApr * values.assetPrice,
    [
      rewardPoolMakeup,
      valueOfDenomInRewardPoolExcludingLSD,
      values.assetPrice,
      values.lsdApr,
    ]
  );
  // TODO: create use context hook to track total values across assets.
  const poolTotalValue = useMemo(
    () => valueOfDenomInRewardPoolIncludingLSD,
    [valueOfDenomInRewardPoolIncludingLSD]
  );
  const percentageMakeupOfRewardPoolValue = useMemo(
    () => valueOfDenomInRewardPoolIncludingLSD / poolTotalValue,
    [poolTotalValue, valueOfDenomInRewardPoolIncludingLSD]
  );

  // TODO: this value will be one thing for LUNA but will change for other assets. track for "is luna"
  const principalStakeExcludingRewards = useMemo(
    () => principalStakeOnTerra,
    [principalStakeOnTerra]
  );
  const principalStakeIncludingLSD = useMemo(
    () => values.totalTokenSupply * values.assetPrice,
    [values.totalTokenSupply, values.assetPrice]
  );
  const stakingRewardValue = useMemo(
    () => rewardPoolPercentage * poolTotalValue,
    [poolTotalValue]
  );
  const stakingAPR = useMemo(
    () =>
      (principalStakeIncludingLSD +
        stakingRewardValue -
        principalStakeOnTerra * values.assetPrice) /
      (principalStakeOnTerra * values.assetPrice),
    [
      principalStakeIncludingLSD,
      principalStakeOnTerra,
      stakingRewardValue,
      values.assetPrice,
    ]
  );

  const derivedValues: Partial<EstimatorCalculatedValues> = {
    rewardPoolOnNativeChain,
    rewardPoolPercentage,
    principalStakeOnTerra,
    rewardPoolMakeup,
    valueOfDenomInRewardPoolExcludingLSD,
    valueOfDenomInRewardPoolIncludingLSD,
    percentageMakeupOfRewardPoolValue,
    poolTotalValue,
    principalStakeExcludingRewards,
    principalStakeIncludingLSD,
    stakingRewardValue,
    stakingAPR,
  };

  // define fields
  const fields: EstimatorField[] = [
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
      label:
        "Principal stake (excluding rewards) amount after 1 year take rate",
      input: false,
    },
    {
      group: "Principal",
      name: "principalStakeIncludingLSD",
      label:
        "Principal stake value (including LSD yield) after 1 year take rate",
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
  const fieldMap: FieldMap = {};

  fields.forEach((field) => {
    if (!fieldMap[field.group]) {
      fieldMap[field.group] = [];
    }
    fieldMap[field.group].push(field);
  });

  // input handler, get field value and update state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = parseFloat(target.value);
    const name = target.name as
      | keyof EstimatorInputValues
      | keyof EstimatorCalculatedValues;
    setValues({
      ...values,
      [name]: value,
    });
  };

  // render table for individual token
  return (
    <div className={styles.container}>
      {Object.keys(fieldMap).map((section) => {
        return (
          <div key={`section-${section}`} className={styles.fieldSection}>
            <h3 className={styles.fieldSectionHeader}>{section}</h3>
            {fieldMap[section].map((field) => (
              <div className={styles.fieldRow} key={field.name}>
                <div className={styles.fieldLabel}>{field.label}:</div>
                <div className={styles.fieldValue}>
                  <input
                    type="number"
                    name={field.name}
                    value={
                      field.input
                        ? values[field.name]
                        : field.name in derivedValues
                        ? derivedValues[field.name].toFixed(2)
                        : ""
                    }
                    onChange={handleInputChange}
                    disabled={!field.input}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Estimator;
