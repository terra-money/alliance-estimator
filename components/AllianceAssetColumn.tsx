import { useMemo, useState } from "react"
import {
  allianceFieldMap,
  AllianceCalculatedValues,
  AllianceInputValues,
} from "@/data"
import { useAppState } from "@/contexts"
import { TAKE_RATE_INTERVAL } from "@/constants"
import styles from "@/styles/AllianceAssetColumn.module.css"
import Card from "./Card"

function AllianceAssetColumn({
  id,
  label,
  userInputValues,
}: {
  id: number
  label: string
  userInputValues: AllianceInputValues
}) {
  const {
    removeAllianceAsset,
    allianceAssets,
    nativeInputValues,
    poolTotalValue,
  } = useAppState()

  const inputValues = allianceAssets[id].inputValues

  const [cardExpansions, setCardExpansions] = useState<Record<string, boolean>>(
    Object.keys(allianceFieldMap).reduce(
      (acc, _, i) => ({ ...acc, [i]: true }),
      {}
    )
  )

  function toggleExpansion(index: number) {
    const newCardState = { [index]: !cardExpansions[index] }
    setCardExpansions({ ...cardExpansions, ...newCardState })
  }

  function expandAll() {
    const newCardState = Object.keys(cardExpansions).reduce(
      (acc, curr) => ({ ...acc, [curr]: true }),
      {}
    )
    setCardExpansions(newCardState)
  }

  function collapseAll() {
    const newCardState = Object.keys(cardExpansions).reduce(
      (acc, curr) => ({ ...acc, [curr]: false }),
      {}
    )
    setCardExpansions(newCardState)
  }

  // global values
  const takeRateInterval = TAKE_RATE_INTERVAL

  // derived values
  // reward pool Percentage
  const rewardPoolPercentage = useMemo(() => {
    let sum = 0

    let thisSum = inputValues.allianceRewardWeight
    Object.values(allianceAssets).forEach((asset) => {
      sum += +asset.inputValues.allianceRewardWeight
    })
    sum += +nativeInputValues.allianceRewardWeight

    return +thisSum / +sum
  }, [
    allianceAssets,
    inputValues.allianceRewardWeight,
    nativeInputValues.allianceRewardWeight,
  ])

  // take rate
  const takeRate = useMemo(() => {
    return (
      1 -
      Math.exp(
        Math.log(inputValues.annualizedTakeRate / 100) /
          (525600 / takeRateInterval)
      )
    )
  }, [inputValues.annualizedTakeRate, takeRateInterval])

  // reward pool makeup
  const rewardPoolMakeup = useMemo(() => {
    return (
      inputValues.assetStakedInAlliance * (inputValues.annualizedTakeRate / 100)
    )
  }, [inputValues.annualizedTakeRate, inputValues.assetStakedInAlliance])

  // value of denom in reward pool excluding LSD
  const valueOfDenomInRewardPoolExcludingLSD = useMemo(() => {
    return rewardPoolMakeup * inputValues.assetPrice
  }, [inputValues.assetPrice, rewardPoolMakeup])

  // value of denom in reward pool including LSD
  const valueOfDenomInRewardPoolIncludingLSD = useMemo(() => {
    return (
      valueOfDenomInRewardPoolExcludingLSD +
      rewardPoolMakeup * (inputValues.lsdApr / 100) * inputValues.assetPrice
    )
  }, [
    inputValues.assetPrice,
    inputValues.lsdApr,
    rewardPoolMakeup,
    valueOfDenomInRewardPoolExcludingLSD,
  ])

  // % makeup of reward pool value
  const percentageMakeupOfRewardPoolValue = useMemo(() => {
    return valueOfDenomInRewardPoolIncludingLSD / poolTotalValue
  }, [poolTotalValue, valueOfDenomInRewardPoolIncludingLSD])

  // principal stake excluding rewards
  const principalStakeExcludingRewards = useMemo(() => {
    return inputValues.assetStakedInAlliance - rewardPoolMakeup
  }, [inputValues.assetStakedInAlliance, rewardPoolMakeup])

  // principal stake including LSD
  const principalStakeIncludingLSD = useMemo(() => {
    return (
      principalStakeExcludingRewards *
      inputValues.assetPrice *
      (1 + inputValues.lsdApr / 100)
    )
  }, [
    inputValues.assetPrice,
    inputValues.lsdApr,
    principalStakeExcludingRewards,
  ])

  // staking reward value
  const stakingRewardValue = useMemo(() => {
    return poolTotalValue * rewardPoolPercentage
  }, [poolTotalValue, rewardPoolPercentage])

  // staking APR
  const stakingAPR = useMemo(() => {
    return (
      (principalStakeIncludingLSD +
        stakingRewardValue -
        inputValues.assetStakedInAlliance * inputValues.assetPrice) /
      (inputValues.assetStakedInAlliance * inputValues.assetPrice)
    )
  }, [
    inputValues.assetPrice,
    inputValues.assetStakedInAlliance,
    principalStakeIncludingLSD,
    stakingRewardValue,
  ])

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
  }

  function handleRemoveAsset() {
    removeAllianceAsset(id)
  }

  // render table for individual token
  return (
    <div className={styles.container}>
      <div className={styles.assetHeader}>
        <h2 className={styles.assetName}>{label}</h2>
        <div className={styles.columnActions}>
          <button onClick={expandAll}>Expand All</button>
          <button onClick={collapseAll}>Collapse All</button>
          <button onClick={handleRemoveAsset}>Remove Asset</button>
        </div>
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
        )
      })}
    </div>
  )
}

export default AllianceAssetColumn
