import { useState, useEffect, useMemo } from "react";
import {
  nativeFieldMap,
  NativeFieldKey,
  NativeCalculatedValues,
  NativeInputValues,
} from "@/data";
import { useAppState } from "@/contexts";
import styles from "@/styles/NativeAssetColumn.module.css";
import Card from "./Card";

function NativeAssetColumn() {
  const { poolTotalValueState, updatePoolTotalValue } = useAppState();

  const [userInputValues, setUserInputValues] = useState<NativeInputValues>({
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
    () => userInputValues.inflationRate * userInputValues.totalTokenSupply,
    [userInputValues.inflationRate, userInputValues.totalTokenSupply]
  );

  // TODO: create use context hook to get pool percentage from all assets.
  const rewardPoolPercentage = 0.9606;

  const principalStakeOnTerra = useMemo(
    () => userInputValues.totalTokenSupply,
    [userInputValues.totalTokenSupply]
  );
  const rewardPoolMakeup = useMemo(
    () => userInputValues.totalTokenSupply * userInputValues.inflationRate,
    [userInputValues.totalTokenSupply, userInputValues.inflationRate]
  );
  const valueOfDenomInRewardPoolExcludingLSD = useMemo(
    () => rewardPoolMakeup * userInputValues.assetPrice,
    [rewardPoolMakeup, userInputValues.assetPrice]
  );

  const valueOfDenomInRewardPoolIncludingLSD = useMemo(
    () =>
      valueOfDenomInRewardPoolExcludingLSD +
      rewardPoolMakeup * userInputValues.lsdApr * userInputValues.assetPrice,
    [
      rewardPoolMakeup,
      valueOfDenomInRewardPoolExcludingLSD,
      userInputValues.assetPrice,
      userInputValues.lsdApr,
    ]
  );

  const poolTotalValue = useMemo(
    () => poolTotalValueState,
    [poolTotalValueState]
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
    () => userInputValues.totalTokenSupply * userInputValues.assetPrice,
    [userInputValues.totalTokenSupply, userInputValues.assetPrice]
  );

  const stakingRewardValue = useMemo(
    () => rewardPoolPercentage * poolTotalValue,
    [poolTotalValue]
  );

  const stakingAPR = useMemo(
    () =>
      (principalStakeIncludingLSD +
        stakingRewardValue -
        principalStakeOnTerra * userInputValues.assetPrice) /
      (principalStakeOnTerra * userInputValues.assetPrice),
    [
      principalStakeIncludingLSD,
      principalStakeOnTerra,
      stakingRewardValue,
      userInputValues.assetPrice,
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
      setUserInputValues({
        ...userInputValues,
        [name]: value,
      });
    }
    updatePoolTotalValue("luna", valueOfDenomInRewardPoolIncludingLSD);
  };

  // helper functions to test for type
  function isInputField(key: NativeFieldKey): key is keyof NativeInputValues {
    return key in userInputValues;
  }

  // render table for individual token
  return (
    <div className={styles.container}>
      <h2 className={styles.assetName}>LUNA</h2>
      {Object.keys(nativeFieldMap).map((section, i) => {
        return (
          <Card
            key={`section-${section}`}
            index={i}
            type="native"
            section={section}
            userInputValues={userInputValues}
            handleInputChange={handleInputChange}
            derivedValues={derivedValues}
          />
        );
      })}
    </div>
  );
}

export default NativeAssetColumn;
