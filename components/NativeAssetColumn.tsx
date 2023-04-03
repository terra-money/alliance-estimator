import { useState, useMemo } from "react";
import {
  nativeFieldMap,
  NativeFieldKey,
  NativeCalculatedValues,
  NativeInputValues,
} from "@/data";
import styles from "@/styles/NativeAssetColumn.module.css";
import Card from './Card';

function NativeAssetColumn() {
  const [values, setValues] = useState<NativeInputValues>({
    inflationRate: 0.07,
    lsdApr: 0,
    totalTokenSupply: 1073271122,
    assetPrice: 1.3,
    allianceRewardWeight: 1,
    annualizedTakeRate: 0,
    denom: "denom",
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
  const derivedValues: NativeCalculatedValues = {
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
    const name = target.name as keyof NativeInputValues;

    if (isInputField(name)) {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  // helper functions to test for type
  function isInputField(key: NativeFieldKey): key is keyof NativeInputValues {
    return key in values;
  }

  function isDerivedField(
    key: NativeFieldKey
  ): key is keyof NativeCalculatedValues {
    return key in derivedValues;
  }

  // render table for individual token
  return (
    <div className={styles.container}>
      <h2 className={styles.assetName}>LUNA</h2>
      {Object.keys(nativeFieldMap).map((section) => {
        return (
          <Card
            key={`section-${section}`}
            type="native"
            section={section}
            values={values}
            handleInputChange={handleInputChange}
            isDerivedField={isDerivedField}
            derivedValues={derivedValues}
          />
        );
      })}
    </div>
  );
}

export default NativeAssetColumn;
