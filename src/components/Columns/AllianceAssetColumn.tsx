import { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  allianceFieldMap,
  AllianceCalculatedValues,
  AllianceInputValues,
} from "data";
import { useAppState } from "contexts";
import { useExampleAppState } from "../../contexts/ExampleAppStateProvider";
import { TAKE_RATE_INTERVAL } from "../../constants";
import styles from "styles/AllianceAssetColumn.module.scss";
import Card from "../Card";
import { ActionButtons } from "components";

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
  const location = useLocation();
  const isExample = location.pathname === "/mock-data";

  const {
    removeAllianceAsset: standardRemoveAllianceAsset,
    allianceAssets: standardAllianceAssets,
    nativeInputValues: standardNativeInputValues,
    poolTotalValue: standardPoolTotalValue,
  } = useAppState();

  const {
    removeAllianceAsset: exampleRemoveAllianceAsset,
    allianceAssets: exampleAllianceAssets,
    exampleNativeInputValues: exampleDemoNativeInputValues,
    poolTotalValue: examplePoolTotalValue,
  } = useExampleAppState();

  const removeAllianceAsset = isExample ? exampleRemoveAllianceAsset : standardRemoveAllianceAsset;
  const allianceAssets = isExample ? exampleAllianceAssets : standardAllianceAssets;
  const nativeInputValues = isExample ? exampleDemoNativeInputValues : standardNativeInputValues;
  const poolTotalValue = isExample ? examplePoolTotalValue : standardPoolTotalValue;

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

  const checkForAllOpened = useCallback(() => {
    const allOpenedCheck = Object.values(cardExpansions).every((v) => v);
    setAllOpened(allOpenedCheck);
  }, [cardExpansions]);

  const checkForAllClosed = useCallback(() => {
    const allClosedCheck = Object.values(cardExpansions).every((v) => !v);
    setAllClosed(allClosedCheck);
  }, [cardExpansions]);

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

  const moreInputRequiredFields = [] as string[];

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
  if (isNaN(rewardPoolPercentage)) {
    moreInputRequiredFields.push("rewardPoolPercentage");
  }

  // take rate
  const takeRate = useMemo(() => {
    return (
      1 -
      Math.exp(
        Math.log(1 - inputValues.annualizedTakeRate / 100) /
          (525600 / takeRateInterval)
      )
    );
  }, [inputValues.annualizedTakeRate, takeRateInterval]);
  if (isNaN(takeRate)) {
    moreInputRequiredFields.push("takeRate");
  }

  // reward pool makeup
  const rewardPoolMakeup = useMemo(() => {
    return (
      inputValues.assetStakedInAlliance * (inputValues.annualizedTakeRate / 100)
    );
  }, [inputValues.annualizedTakeRate, inputValues.assetStakedInAlliance]);
  if (isNaN(rewardPoolMakeup)) {
    moreInputRequiredFields.push("rewardPoolMakeup");
  }

  // value of denom in reward pool excluding LSD
  const valueOfDenomInRewardPoolExcludingLSD = useMemo(() => {
    return rewardPoolMakeup * inputValues.assetPrice;
  }, [inputValues.assetPrice, rewardPoolMakeup]);
  if (isNaN(valueOfDenomInRewardPoolExcludingLSD)) {
    moreInputRequiredFields.push("valueOfDenomInRewardPoolExcludingLSD");
  }

  // value of denom in reward pool including LSD
  const valueOfDenomInRewardPoolIncludingLSD = useMemo(() => {
    return (
      valueOfDenomInRewardPoolExcludingLSD +
      rewardPoolMakeup * (inputValues.lsdAnnualEstimate / 100) * inputValues.assetPrice
    );
  }, [
    inputValues.assetPrice,
    inputValues.lsdAnnualEstimate,
    rewardPoolMakeup,
    valueOfDenomInRewardPoolExcludingLSD,
  ]);
  if (isNaN(valueOfDenomInRewardPoolIncludingLSD)) {
    moreInputRequiredFields.push("valueOfDenomInRewardPoolIncludingLSD");
  }

  // % makeup of reward pool value
  const percentageMakeupOfRewardPoolValue = useMemo(() => {
    return valueOfDenomInRewardPoolIncludingLSD / poolTotalValue;
  }, [poolTotalValue, valueOfDenomInRewardPoolIncludingLSD]);
  if (isNaN(percentageMakeupOfRewardPoolValue)) {
    moreInputRequiredFields.push("percentageMakeupOfRewardPoolValue");
  }

  // principal stake excluding rewards
  const principalStakeExcludingRewards = useMemo(() => {
    return inputValues.assetStakedInAlliance - rewardPoolMakeup;
  }, [inputValues.assetStakedInAlliance, rewardPoolMakeup]);
  if (isNaN(principalStakeExcludingRewards)) {
    moreInputRequiredFields.push("principalStakeExcludingRewards");
  }

  // principal stake including LSD
  const principalStakeIncludingLSD = useMemo(() => {
    return (
      principalStakeExcludingRewards *
      inputValues.assetPrice *
      (1 + inputValues.lsdAnnualEstimate / 100)
    );
  }, [
    inputValues.assetPrice,
    inputValues.lsdAnnualEstimate,
    principalStakeExcludingRewards,
  ]);
  if (isNaN(principalStakeIncludingLSD)) {
    moreInputRequiredFields.push("principalStakeIncludingLSD");
  }

  // staking reward value
  const stakingRewardValue = useMemo(() => {
    return poolTotalValue * rewardPoolPercentage;
  }, [poolTotalValue, rewardPoolPercentage]);
  if (isNaN(stakingRewardValue)) {
    moreInputRequiredFields.push("stakingRewardValue");
  }

  // staking lsdAnnualEstimate
  const stakingEstimatedPercentage = useMemo(() => {
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
  if (isNaN(stakingEstimatedPercentage)) {
    moreInputRequiredFields.push("stakingEstimatedPercentage");
  }

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
    stakingEstimatedPercentage,
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
              moreInputRequiredFields={moreInputRequiredFields}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AllianceAssetColumn;
