import { useState } from "react";
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
  principalStakeIncludingRewards: number;
  stakingRewardValue: number;
  stakingAPR: number;
}

interface EstimatorField {
  name: keyof EstimatorInputValues | keyof EstimatorCalculatedValues;
  label: string;
  input: boolean;
  calculate?: () => number;
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
      calculate: () => values.inflationRate * values.totalTokenSupply,
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
      calculate: () => {
        // TODO create hook to get pool percentage from all assets.
        return 0.9606;
      },
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
      calculate: () => values.totalTokenSupply,
    },
    {
      group: "Reward Pool",
      name: "rewardPoolMakeup",
      label: "Reward Pool Makeup after 1 year (take rate included)",
      input: false,
      calculate: () => values.totalTokenSupply * values.inflationRate,
    },
    {
      group: "Reward Pool",
      name: "valueOfDenomInRewardPoolExcludingLSD",
      label: "Value of denom in reward pool (excluding LSD yield)",
      input: false,
      calculate: () =>
        values.totalTokenSupply * values.inflationRate * values.assetPrice,
    },
    {
      group: "Reward Pool",
      name: "valueOfDenomInRewardPoolIncludingLSD",
      label: "Value of denom in reward pool after 1 yr LSD yield",
      input: false,
      calculate: () =>
        values.totalTokenSupply * values.inflationRate * values.assetPrice +
        values.totalTokenSupply *
          values.inflationRate *
          values.lsdApr *
          values.assetPrice,
    },
    {
      group: "Reward Pool",
      name: "percentageMakeupOfRewardPoolValue",
      label: "% makeup of reward pool value",
      input: false,
      calculate: () =>
        (values.totalTokenSupply * values.inflationRate * values.assetPrice +
          values.totalTokenSupply *
            values.inflationRate *
            values.lsdApr *
            values.assetPrice) /
        (values.totalTokenSupply * values.inflationRate * values.assetPrice +
          values.totalTokenSupply *
            values.inflationRate *
            values.lsdApr *
            values.assetPrice),
    },
    {
      group: "Pool Total Value",
      name: "percentageMakeupOfRewardPoolValue",
      label: "(including LSD appreciation)",
      input: false,
      calculate: () => {
        // TODO: create hook to track value of all value with LSD
        return (
          values.totalTokenSupply * values.inflationRate * values.assetPrice +
          values.totalTokenSupply *
            values.inflationRate *
            values.lsdApr *
            values.assetPrice
        );
      },
    },
    {
      group: "Principal",
      name: "principalStakeExcludingRewards",
      label:
        "Principal stake (excluding rewards) amount after 1 year take rate",
      input: false,
      calculate: () => values.totalTokenSupply,
    },
    {
      group: "Principal",
      name: "principalStakeIncludingRewards",
      label:
        "Principal stake value (including LSD yield) after 1 year take rate",
      input: false,
      calculate: () => values.totalTokenSupply * values.assetPrice,
    },
    {
      group: "Yield",
      name: "stakingRewardValue",
      label: "Staking reward value (including LSD yield)",
      input: false,
      calculate: () =>
        0.9606 *
        (values.totalTokenSupply * values.inflationRate * values.assetPrice +
          values.totalTokenSupply *
            values.inflationRate *
            values.lsdApr *
            values.assetPrice),
    },
    {
      group: "Yield",
      name: "stakingAPR",
      label: "Staking APR (including LSD appreciation and take rate)",
      input: false,
      calculate: () => {
        //=(B26+B29-(B16*B8))/(B16*B8)
        const principalStakeIncludingRewards =
          values.totalTokenSupply * values.assetPrice;
        const stakingRewardValue =
          0.9606 *
          (values.totalTokenSupply * values.inflationRate * values.assetPrice +
            values.totalTokenSupply *
              values.inflationRate *
              values.lsdApr *
              values.assetPrice);
        const principalStakeOnTerra = values.totalTokenSupply;
        const assetPrice = values.assetPrice;

        return (
          (principalStakeIncludingRewards +
            stakingRewardValue -
            principalStakeOnTerra * assetPrice) /
          (principalStakeOnTerra * assetPrice)
        );
      },
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
                      field.calculate
                        ? field.calculate().toFixed(2)
                        : values[field.name]
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
