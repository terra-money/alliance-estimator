import { useState, useMemo } from "react";
import {
  allianceFieldMap,
  AllianceFieldKey,
  AllianceCalculatedValues,
  AllianceInputValues,
} from "@/data";
import styles from "@/styles/AllianceAssetColumn.module.css";
import Card from './Card';

function AllianceAssetColumn({ name }: { name: string }) {
  const [values, setValues] = useState<AllianceInputValues>({
    inflationRate: 0.07,
    lsdApr: 0,
    totalTokenSupply: 1073271122,
    assetPrice: 1.3,
    allianceRewardWeight: 1,
    annualizedTakeRate: 0,
    denom: "",
  });

  // cache derived values
  const rewardPoolOnAllianceChain = useMemo(
    () => values.inflationRate * values.totalTokenSupply,
    [values.inflationRate, values.totalTokenSupply]
  );

  // TODO: create use context hook to get pool percentage from all assets.
  const rewardPoolPercentage = 0.9606;

  const takeRateInterval = 5;
  const takeRate = 0.0000174331 // Some crazy complicated formula

  const principalStakeOnNativeChain = useMemo(
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
    () => principalStakeOnNativeChain,
    [principalStakeOnNativeChain]
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
        principalStakeOnNativeChain * values.assetPrice) /
      (principalStakeOnNativeChain * values.assetPrice),
    [
      principalStakeIncludingLSD,
      principalStakeOnNativeChain,
      stakingRewardValue,
      values.assetPrice,
    ]
  );

  // create map to lookup derived values later
  const derivedValues: AllianceCalculatedValues = {
    rewardPoolOnAllianceChain,
    rewardPoolPercentage,
    principalStakeOnNativeChain,
    rewardPoolMakeup,
    valueOfDenomInRewardPoolExcludingLSD,
    valueOfDenomInRewardPoolIncludingLSD,
    percentageMakeupOfRewardPoolValue,
    poolTotalValue,
    principalStakeExcludingRewards,
    principalStakeIncludingLSD,
    stakingRewardValue,
    stakingAPR,
    takeRateInterval,
    takeRate,
  };

  // input handler, get field value and update state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = parseFloat(target.value);
    const name = target.name as keyof AllianceInputValues;

    if (isInputField(name)) {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  // helper functions to test for type
  function isInputField(
    key: AllianceFieldKey
  ): key is keyof AllianceInputValues {
    return key in values;
  }

  function isDerivedField(
    key: AllianceFieldKey
  ): key is keyof AllianceCalculatedValues {
    return key in derivedValues;
  }

  // render table for individual token
  return (
    <div className={styles.container}>
      <h2 className={styles.assetName}>{name}</h2>
      {Object.keys(allianceFieldMap).map((section) => {
        return (
          <Card
            key={`section-${section}`}
            type="alliance"
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

export default AllianceAssetColumn;
