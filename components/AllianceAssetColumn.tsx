import { useState, useMemo } from "react";
import {
  allianceFieldMap,
  AllianceFieldKey,
  AllianceCalculatedValues,
  AllianceInputValues,
} from "@/data";
import { useAppState } from "@/contexts";
import styles from "@/styles/AllianceAssetColumn.module.css";
import Card from './Card';

function AllianceAssetColumn({ id, label }: { id: number; label: string }) {
  const { removeAllianceAsset, poolTotalValueState, updatePoolTotalValue } =
    useAppState();

  const [values, setValues] = useState<AllianceInputValues>({
    inflationRate: 0.07,
    lsdApr: 0,
    totalTokenSupply: 100,
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

  const percentageMakeupOfRewardPoolValue = useMemo(
    () => valueOfDenomInRewardPoolIncludingLSD / poolTotalValueState,
    [poolTotalValueState, valueOfDenomInRewardPoolIncludingLSD]
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
    () => rewardPoolPercentage * poolTotalValueState,
    [poolTotalValueState]
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

    updatePoolTotalValue(id.toString(), valueOfDenomInRewardPoolIncludingLSD);
  };

  function handleRemoveAsset() {
    removeAllianceAsset(id);
  }

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
      <div className={styles.assetHeader}>
        <h2 className={styles.assetName}>
          {id} - {label}
        </h2>
        <div className={styles.removeButton}>
          <button onClick={handleRemoveAsset}>Remove Asset</button>
        </div>
      </div>
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
