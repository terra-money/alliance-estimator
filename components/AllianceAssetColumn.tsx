import { useMemo, useState } from "react";
import Image from 'next/image';
import {
  allianceFieldMap,
  AllianceCalculatedValues,
  AllianceInputValues,
} from "@/data";
import { useAppState } from "@/contexts";
import styles from "@/styles/AllianceAssetColumn.module.scss";
import { TAKE_RATE_INTERVAL } from "@/constants";
import Card from "./Card";
import ActionButtons from './ActionButtons';

function AllianceAssetColumn({
  id,
  label,
  userInputValues,
  changeColumnTitle,
}: {
  id: number;
  label: string;
  userInputValues: AllianceInputValues;
  changeColumnTitle: (id: number, name: string) => void;
}) {
  const {
    removeAllianceAsset,
    allianceAssets,
    nativeInputValues,
    poolTotalValue,
  } = useAppState();

  const inputValues = allianceAssets[id].inputValues;

  const [assetName, setAssetName] = useState<string>(label);
  const [editName, setEditName] = useState<boolean>(false)
  const [cardExpansions, setCardExpansions] = useState<Record<string, boolean>>(
    Object.keys(allianceFieldMap).reduce(
      (acc, _, i) => ({ ...acc, [i]: true }),
      {}
    )
  );

  function toggleExpansion(index: number) {
    const newCardState = { [index]: !cardExpansions[index] };
    setCardExpansions({ ...cardExpansions, ...newCardState });
  }

  function expandAll() {
    const newCardState = Object.keys(cardExpansions).reduce(
      (acc, curr) => ({ ...acc, [curr]: true }),
      {}
    );
    setCardExpansions(newCardState);
  }

  function collapseAll() {
    const newCardState = Object.keys(cardExpansions).reduce(
      (acc, curr) => ({ ...acc, [curr]: false }),
      {}
    );
    setCardExpansions(newCardState);
  }

  // global values
  const takeRateInterval = TAKE_RATE_INTERVAL;

  // derived values
  // reward pool Percentage
  const rewardPoolPercentage = useMemo(() => {
    let sum = 0;

    let thisSum = inputValues.allianceRewardWeight;
    Object.values(allianceAssets).forEach((asset) => {
      sum += parseInt(asset.inputValues.allianceRewardWeight);
    });
    sum += nativeInputValues.allianceRewardWeight;

    return thisSum / sum;
  }, [
    allianceAssets,
    inputValues.allianceRewardWeight,
    nativeInputValues.allianceRewardWeight,
  ]);

  // take rate
  const takeRate = useMemo(() => {
    return (
      1 -
      Math.exp(
        Math.log(inputValues.annualizedTakeRate) / (525600 / takeRateInterval)
      )
    );
  }, [inputValues.annualizedTakeRate, takeRateInterval]);

  // reward pool makeup
  const rewardPoolMakeup = useMemo(() => {
    return (
      inputValues.principalStakeOnNativeChain * inputValues.annualizedTakeRate
    );
  }, [inputValues.annualizedTakeRate, inputValues.principalStakeOnNativeChain]);

  // value of denom in reward pool excluding LSD
  const valueOfDenomInRewardPoolExcludingLSD = useMemo(() => {
    return rewardPoolMakeup * inputValues.assetPrice;
  }, [inputValues.assetPrice, rewardPoolMakeup]);

  // value of denom in reward pool including LSD
  const valueOfDenomInRewardPoolIncludingLSD = useMemo(() => {
    return (
      valueOfDenomInRewardPoolExcludingLSD +
      rewardPoolMakeup * inputValues.lsdApr * inputValues.assetPrice
    );
  }, [
    inputValues.assetPrice,
    inputValues.lsdApr,
    rewardPoolMakeup,
    valueOfDenomInRewardPoolExcludingLSD,
  ]);

  // % makeup of reward pool value
  const percentageMakeupOfRewardPoolValue = useMemo(() => {
    return valueOfDenomInRewardPoolIncludingLSD / poolTotalValue;
  }, [poolTotalValue, valueOfDenomInRewardPoolIncludingLSD]);

  // principal stake excluding rewards
  const principalStakeExcludingRewards = useMemo(() => {
    return inputValues.principalStakeOnNativeChain - rewardPoolMakeup;
  }, [inputValues.principalStakeOnNativeChain, rewardPoolMakeup]);

  // principal stake including LSD
  const principalStakeIncludingLSD = useMemo(() => {
    return (
      principalStakeExcludingRewards *
      inputValues.assetPrice *
      (1 + inputValues.lsdApr)
    );
  }, [
    inputValues.assetPrice,
    inputValues.lsdApr,
    principalStakeExcludingRewards,
  ]);

  // staking reward value
  const stakingRewardValue = useMemo(() => {
    return poolTotalValue * rewardPoolPercentage;
  }, [poolTotalValue, rewardPoolPercentage]);

  // staking APR
  const stakingAPR = useMemo(() => {
    return (
      (principalStakeIncludingLSD +
        stakingRewardValue -
        inputValues.principalStakeOnNativeChain * inputValues.assetPrice) /
      (inputValues.principalStakeOnNativeChain * inputValues.assetPrice)
    );
  }, [
    inputValues.assetPrice,
    inputValues.principalStakeOnNativeChain,
    principalStakeIncludingLSD,
    stakingRewardValue,
  ]);

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

  function handleColumnTitle(event: any) {
    setAssetName(event.target.value)
  }

  function handleInputSubmit() {
    setEditName(false)
    changeColumnTitle(id, assetName)
  }

  // render table for individual token
  return (
    <div className={styles.container}>
      <div className={styles.assetHeader}>
        <div className={styles.leftSide}>
          {editName ? (
            <>
              <input
                className={styles.assetName}
                type="text"
                value={assetName}
                onChange={handleColumnTitle}
                autoFocus={true}
                onKeyDown={({ key }) => key === "Enter" ? handleInputSubmit() : {}}
              />
              <div
                className={styles.iconContainer}
              >
                <div className={styles.iconBackground}></div>
                <Image
                  className={styles.icon}
                  src="/Icons/Check.svg"
                  alt="Confirm"
                  width={20}
                  height={20}
                  onClick={handleInputSubmit}
                />
              </div>
            </>
          ) : (
            <>
              <h2
                className={styles.assetName}
                onClick={() => setEditName(true)}
              >
                {assetName}
              </h2>
              <Image
                className={styles.icon}
                src="/Icons/Pencil.svg"
                alt="Edit Asset Name"
                width={20}
                height={20}
                onClick={() => setEditName(true)}
              />
              <Image
                className={styles.icon}
                src="/Icons/Trash.svg"
                alt="Edit Asset Name"
                width={20}
                height={20}
                onClick={handleRemoveAsset}
              />
            </>
          )}
        </div>
        <ActionButtons
          expandAll={expandAll}
          collapseAll={collapseAll}
        />
      </div>
      {Object.keys(allianceFieldMap).map((section, i) => {
        return (
          <Card
            toggleExpansion={toggleExpansion}
            expanded={cardExpansions[i]}
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
