import { useMemo, useState, useEffect } from "react";
import {
  allianceFieldMap,
  AllianceCalculatedValues,
  AllianceInputValues,
} from "data";
import { useAppState } from "contexts";
import { TAKE_RATE_INTERVAL } from "../constants";
import styles from "styles/AllianceAssetColumn.module.scss";
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

  const [allOpened, setAllOpened] = useState<boolean>(true);
  const [allClosed, setAllClosed] = useState<boolean>(false);

  const checkForAllOpened = () => {
    const allOpenedCheck = Object.values(cardExpansions).every((v) => v);
    setAllOpened(allOpenedCheck);
  };

  const checkForAllClosed = () => {
    const allClosedCheck = Object.values(cardExpansions).every((v) => !v);
    setAllClosed(allClosedCheck);
  };

  useEffect(() => {
    checkForAllClosed()
    checkForAllOpened()
  }, [cardExpansions, checkForAllClosed, checkForAllOpened]);

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
      sum += +asset.inputValues.allianceRewardWeight;
    });
    sum += +nativeInputValues.allianceRewardWeight;

    return +thisSum / +sum;
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
        Math.log(inputValues.annualizedTakeRate / 100) /
          (525600 / takeRateInterval)
      )
    );
  }, [inputValues.annualizedTakeRate, takeRateInterval]);

  // reward pool makeup
  const rewardPoolMakeup = useMemo(() => {
    return (
      inputValues.assetStakedInAlliance * (inputValues.annualizedTakeRate / 100)
    );
  }, [inputValues.annualizedTakeRate, inputValues.assetStakedInAlliance]);

  // value of denom in reward pool excluding LSD
  const valueOfDenomInRewardPoolExcludingLSD = useMemo(() => {
    return rewardPoolMakeup * inputValues.assetPrice;
  }, [inputValues.assetPrice, rewardPoolMakeup]);

  // value of denom in reward pool including LSD
  const valueOfDenomInRewardPoolIncludingLSD = useMemo(() => {
    return (
      valueOfDenomInRewardPoolExcludingLSD +
      rewardPoolMakeup * (inputValues.lsdApr / 100) * inputValues.assetPrice
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
    return inputValues.assetStakedInAlliance - rewardPoolMakeup;
  }, [inputValues.assetStakedInAlliance, rewardPoolMakeup]);

  // principal stake including LSD
  const principalStakeIncludingLSD = useMemo(() => {
    return (
      principalStakeExcludingRewards *
      inputValues.assetPrice *
      (1 + inputValues.lsdApr / 100)
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
        inputValues.assetStakedInAlliance * inputValues.assetPrice) /
      (inputValues.assetStakedInAlliance * inputValues.assetPrice)
    );
  }, [
    inputValues.assetPrice,
    inputValues.assetStakedInAlliance,
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
                <img
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
              <img
                className={styles.icon}
                src="/Icons/Pencil.svg"
                alt="Edit Asset Name"
                width={14}
                height={14}
                onClick={() => setEditName(true)}
              />
              <img
                className={styles.icon}
                src="/Icons/Trash.svg"
                alt="Edit Asset Name"
                width={14}
                height={14}
                onClick={handleRemoveAsset}
              />
            </>
          )}
        </div>
        <ActionButtons
          expandAll={expandAll}
          collapseAll={collapseAll}
          allOpened={allOpened}
          allClosed={allClosed}
        />
      </div>
      <div className={styles.cards}>
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
    </div>
  );
}

export default AllianceAssetColumn;
