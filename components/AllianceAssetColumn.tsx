import { useMemo } from "react";
import {
  allianceFieldMap,
  AllianceFieldKey,
  AllianceCalculatedValues,
  AllianceInputValues,
} from "@/data";
import { useAppState } from "@/contexts";
import styles from "@/styles/AllianceAssetColumn.module.css";
import Card from "./Card";

function AllianceAssetColumn({
  id,
  label,
  userInputValues,
}: {
  id: number;
  label: string;
  userInputValues: AllianceInputValues;
}) {
  const { removeAllianceAsset, allianceAssets, nativeInputValues } =
    useAppState();

  // global values
  const rewardPoolPercentage = 0.01;
  const takeRateInterval = 5;
  const takeRate = 0.0000174331; // Some crazy complicated formula
  const percentageMakeupOfRewardPoolValue = 0.5;

  // derived values
  const rewardPoolMakeup = useMemo(() => {
    let sum = 0;

    if (!allianceAssets[id]) return 0;
    let thisSum = allianceAssets[id].inputValues.allianceRewardWeight;
    Object.values(allianceAssets).forEach((asset) => {
      sum += parseInt(asset.inputValues.allianceRewardWeight);
    });
    sum += nativeInputValues.allianceRewardWeight;

    console.log(
      "reward pool has updated",
      id,
      allianceAssets[id].inputValues.allianceRewardWeight,
      sum
    );

    return thisSum / sum;
  }, [allianceAssets, id, nativeInputValues.allianceRewardWeight]);

  const valueOfDenomInRewardPoolExcludingLSD = useMemo(
    () => userInputValues.lsdApr * 10,
    [userInputValues.lsdApr]
  );
  const valueOfDenomInRewardPoolIncludingLSD = useMemo(
    () => userInputValues.lsdApr * 10,
    [userInputValues.lsdApr]
  );
  const principalStakeExcludingRewards = useMemo(
    () => userInputValues.lsdApr * 10,
    [userInputValues.lsdApr]
  );
  const principalStakeIncludingLSD = useMemo(
    () => userInputValues.lsdApr * 10,
    [userInputValues.lsdApr]
  );
  const stakingRewardValue = useMemo(
    () => userInputValues.lsdApr * 10,
    [userInputValues.lsdApr]
  );
  const stakingAPR = useMemo(
    () => userInputValues.lsdApr * 10,
    [userInputValues.lsdApr]
  );

  // create map to lookup derived values later
  const derivedValues: AllianceCalculatedValues = {
    rewardPoolPercentage,
    takeRateInterval,
    takeRate,
    rewardPoolMakeup,
    valueOfDenomInRewardPoolExcludingLSD,
    valueOfDenomInRewardPoolIncludingLSD,
    percentageMakeupOfRewardPoolValue,
    principalStakeExcludingRewards,
    principalStakeIncludingLSD,
    stakingRewardValue,
    stakingAPR,
  };

  function handleRemoveAsset() {
    removeAllianceAsset(id);
  }

  console.log({ rewardPoolMakeup });

  // render table for individual token
  return (
    <div className={styles.container}>
      <div className={styles.assetHeader}>
        <h2 className={styles.assetName}>{label}</h2>
        <div className={styles.removeButton}>
          <button onClick={handleRemoveAsset}>Remove Asset</button>
        </div>
      </div>
      {Object.keys(allianceFieldMap).map((section, i) => {
        return (
          <Card
            key={`section-${section}`}
            assetId={id}
            index={i}
            type="alliance"
            section={section}
            userInputValues={userInputValues}
            derivedValues={derivedValues}
          />
        );
      })}
    </div>
  );
}

export default AllianceAssetColumn;
