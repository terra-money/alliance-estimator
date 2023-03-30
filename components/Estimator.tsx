import { useState, useMemo } from "react";
import {
  fieldMap,
  EstimatorFieldKey,
  EstimatorCalculatedValues,
  EstimatorInputValues,
} from "@/data";
import styles from "@/styles/Estimator.module.css";

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

  // create map to lookup derived values later
  const derivedValues: EstimatorCalculatedValues = {
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

  // input handler, get field value and update state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = parseFloat(target.value);
    const name = target.name as keyof EstimatorInputValues;

    if (isInputField(name)) {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  // helper functions to test for type
  function isInputField(
    key: EstimatorFieldKey
  ): key is keyof EstimatorInputValues {
    return key in values;
  }

  function isDerivedField(
    key: EstimatorFieldKey
  ): key is keyof EstimatorCalculatedValues {
    return key in derivedValues;
  }

  // render table for individual token
  return (
    <div className={styles.container}>
      {Object.keys(fieldMap).map((section) => {
        return (
          <div key={`section-${section}`} className={styles.fieldSection}>
            <h3 className={styles.fieldSectionHeader}>{section}</h3>
            {fieldMap[section].map((field, i) => (
              <div
                className={`${styles.fieldRow} ${!(i % 2) && styles.greybg}`}
                key={field.name}
              >
                <div className={styles.fieldLabel}>{field.label}:</div>
                <div className={styles.fieldValue}>
                  <input
                    type="number"
                    name={field.name}
                    value={
                      field.input
                        ? values[field.name as keyof EstimatorInputValues]
                        : isDerivedField(field.name)
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
