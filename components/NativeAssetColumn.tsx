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

function NativeAssetColumn({
  userInputValues,
}: {
  userInputValues: NativeInputValues;
}) {
  const { poolTotalValue } = useAppState();

  // cache derived values
  const rewardPoolOnNativeChain = useMemo(
    () => userInputValues.inflationRate * userInputValues.totalTokenSupply,
    [userInputValues.inflationRate, userInputValues.totalTokenSupply]
  );

  // TODO: create use context hook to get pool percentage from all assets.
  const rewardPoolPercentage = 1;

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

  const percentageMakeupOfRewardPoolValue = useMemo(
    () => valueOfDenomInRewardPoolIncludingLSD / poolTotalValue,
    [poolTotalValue, valueOfDenomInRewardPoolIncludingLSD]
  );

  const principalStakeExcludingRewards = useMemo(
    () => userInputValues.principalStakeOnNativeChain,
    [userInputValues.principalStakeOnNativeChain]
  );

  const principalStakeIncludingLSD = useMemo(
    () => principalStakeExcludingRewards * userInputValues.assetPrice,
    [principalStakeExcludingRewards, userInputValues.assetPrice]
  );

  const stakingRewardValue = useMemo(
    () => rewardPoolPercentage * poolTotalValue,
    [poolTotalValue]
  );

  const stakingAPR = useMemo(
    () =>
      (principalStakeIncludingLSD +
        stakingRewardValue -
        userInputValues.principalStakeOnNativeChain *
          userInputValues.assetPrice) /
      (userInputValues.principalStakeOnNativeChain *
        userInputValues.assetPrice),
    [
      principalStakeIncludingLSD,
      userInputValues.principalStakeOnNativeChain,
      stakingRewardValue,
      userInputValues.assetPrice,
    ]
  );

  // map to lookup derived values later
  const derivedValues: NativeCalculatedValues = {
    rewardPoolOnNativeChain,
    rewardPoolPercentage,
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

  // render table for individual token
  return (
    <div className={styles.container}>
      <div className={styles.assetHeader}>
        <h2 className={styles.assetName}>LUNA</h2>
      </div>
      {Object.keys(nativeFieldMap).map((section, i) => {
        return (
          <Card
            key={`section-${section}`}
            index={i}
            type="native"
            section={section}
            userInputValues={userInputValues}
            derivedValues={derivedValues}
          />
        );
      })}
    </div>
  );
}

export default NativeAssetColumn;
