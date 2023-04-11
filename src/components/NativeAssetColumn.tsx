import { useState, useMemo, useEffect } from "react";
import {
  nativeFieldMap,
  NativeCalculatedValues,
  NativeInputValues,
} from "data";
import { useAppState } from "contexts";
import styles from "styles/NativeAssetColumn.module.scss";
import Card from "./Card";
import ActionButtons from './ActionButtons';

function NativeAssetColumn({
  userInputValues,
  setNativeInputValues,
}: {
  userInputValues: NativeInputValues;
  setNativeInputValues: (values: NativeInputValues) => void;
}) {
  const { poolTotalValue: poolTotal, allianceAssets } = useAppState();
  const [assetName, setAssetName] = useState<string>(userInputValues.columnName);
  const [editName, setEditName] = useState<boolean>(false)
  const [cardExpansions, setCardExpansions] = useState<Record<string, boolean>>(
    Object.keys(nativeFieldMap).reduce(
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

  const poolTotalValue = useMemo(() => poolTotal, [poolTotal]);

  // cache derived values
  const rewardPoolOnNativeChain = useMemo(
    () =>
      (userInputValues.inflationRate / 100) * userInputValues.totalTokenSupply,
    [userInputValues.inflationRate, userInputValues.totalTokenSupply]
  );

  const rewardPoolPercentage = useMemo(() => {
    let allianceTotalWeight = 0;

    let nativeWeight = userInputValues.allianceRewardWeight;

    Object.values(allianceAssets).forEach((asset) => {
      allianceTotalWeight += +asset.inputValues.allianceRewardWeight;
    });

    return +nativeWeight / (+allianceTotalWeight + +nativeWeight);
  }, [allianceAssets, userInputValues.allianceRewardWeight]);

  const rewardPoolMakeup = useMemo(
    () =>
      userInputValues.totalTokenSupply * (userInputValues.inflationRate / 100),
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
    () => userInputValues.assetStakedInAlliance,
    [userInputValues.assetStakedInAlliance]
  );

  const principalStakeIncludingLSD = useMemo(
    () => principalStakeExcludingRewards * userInputValues.assetPrice,
    [principalStakeExcludingRewards, userInputValues.assetPrice]
  );

  const stakingRewardValue = useMemo(
    () => rewardPoolPercentage * poolTotalValue,
    [poolTotalValue, rewardPoolPercentage]
  );

  const stakingAPR = useMemo(
    () =>
      (principalStakeIncludingLSD +
        stakingRewardValue -
        userInputValues.assetStakedInAlliance * userInputValues.assetPrice) /
      (userInputValues.assetStakedInAlliance * userInputValues.assetPrice),
    [
      principalStakeIncludingLSD,
      userInputValues.assetStakedInAlliance,
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

  function handleColumnTitle(event: any) {
    setAssetName(event.target.value)
  }

  function handleInputSubmit() {
    setEditName(false)
    setNativeInputValues({
      ...userInputValues,
      columnName: assetName,
    })
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
        {Object.keys(nativeFieldMap).map((section, i) => {
          return (
            <Card
              toggleExpansion={toggleExpansion}
              expanded={cardExpansions[i]}
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
    </div>
  );
}

export default NativeAssetColumn;
