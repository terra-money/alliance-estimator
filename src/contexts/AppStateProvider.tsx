import { type ReactNode, useMemo, useEffect } from "react"
import { createContext, useLocalStorage } from "utils"
import { MOCK_DATA, USE_MOCK_DATA } from "../constants"
import {
  type NativeInputValues,
  type AllianceInputValues,
  isInputField,
} from "data"
import { decodeBase64, encodeBase64 } from "utils"

type AllianceAssets = Record<
  number,
  {
    name: string
    inputValues: AllianceInputValues
  }
>

export interface IAppState {
  allianceAssets: AllianceAssets
  addAllianceAsset: (asset: string) => void
  removeAllianceAsset: (index: number) => void
  poolTotalValue: number
  nativeInputValues: NativeInputValues
  handleNativeInputChange: (
    fieldName: keyof NativeInputValues,
    value: string | number
  ) => void
  handleAllianceInputChange: (
    fieldId: number,
    fieldName: keyof AllianceInputValues,
    value: string | number
  ) => void
  setAllianceAssets: (newAssets: AllianceAssets) => void
  setNativeInputValues: (newValues: NativeInputValues) => void
  shareLink: string
}

export const [useAppState, AppStateProvider] =
  createContext<IAppState>("useAppState")

export function InitAppState({ children }: { children: ReactNode }) {
  // state
  const [nativeInputValues, setNativeInputValues] =
    useLocalStorage<NativeInputValues>("nativeAsset", {
      columnName: "Native",
      inflationRate: 7,
      lsdApr: 0,
      assetStakedInAlliance: 527724946,
      totalTokenSupply: 1073271122,
      assetPrice: 1.3,
      allianceRewardWeight: 1,
      denom: "LUNA",
    })
  const [allianceAssets, setAllianceAssets] = useLocalStorage<AllianceAssets>(
    "allianceAssets",
    USE_MOCK_DATA ? { ...MOCK_DATA } : {}
  )

  const shareLink = useMemo(() => {
    return (
      window.location.href +
      "?importData=" +
      encodeBase64(JSON.stringify({ allianceAssets, nativeInputValues }))
    )
  }, [allianceAssets, nativeInputValues])

  const poolTotalValue = useMemo(() => {
    let allianceAssetValue = 0
    let nativeAssetValue = 0
    Object.values(allianceAssets).forEach(
      (asset: { name: string; inputValues: AllianceInputValues }) => {
        const inputValues = asset.inputValues
        allianceAssetValue +=
          inputValues.assetStakedInAlliance *
            (inputValues.annualizedTakeRate / 100) *
            inputValues.assetPrice +
          inputValues.assetStakedInAlliance *
            (inputValues.annualizedTakeRate / 100) *
            (inputValues.lsdApr / 100) *
            inputValues.assetPrice
      }
    )

    nativeAssetValue =
      nativeInputValues.totalTokenSupply *
        (nativeInputValues.inflationRate / 100) *
        nativeInputValues.assetPrice +
      nativeInputValues.totalTokenSupply *
        (nativeInputValues.inflationRate / 100) *
        0 *
        nativeInputValues.assetPrice

    return allianceAssetValue + nativeAssetValue
  }, [
    allianceAssets,
    nativeInputValues.assetPrice,
    nativeInputValues.inflationRate,
    nativeInputValues.totalTokenSupply,
  ])

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    const importData = searchParams.get("importData")

    if (importData) {
      const data = JSON.parse(decodeBase64(importData))
      if (data.allianceAssets) setAllianceAssets({ ...data.allianceAssets })
      if (data.nativeInputValues)
        setNativeInputValues({ ...data.nativeInputValues })
      window.location.href = "/"
    }
  }, [
    allianceAssets,
    nativeInputValues,
    setAllianceAssets,
    setNativeInputValues,
  ])

  // handlers
  // native input update handler
  const handleNativeInputChange = (
    fieldName: keyof NativeInputValues,
    value: string | number
  ) => {
    if (isInputField(fieldName, nativeInputValues)) {
      setNativeInputValues({
        ...nativeInputValues,
        [fieldName]: value,
      })
    }
  }

  // alliance input handler
  const handleAllianceInputChange = (
    fieldId: number,
    fieldName: keyof AllianceInputValues,
    value: string | number
  ) => {
    if (isInputField(fieldName, allianceAssets[fieldId].inputValues)) {
      setAllianceAssets({
        ...allianceAssets,
        [fieldId]: {
          ...allianceAssets[fieldId],
          inputValues: {
            ...allianceAssets[fieldId].inputValues,
            [fieldName]: value,
          },
        },
      })
    }
  }

  function addAllianceAsset(asset: string) {
    const newAsset: AllianceInputValues = {
      lsdApr: 0,
      assetPrice: 0,
      allianceRewardWeight: 0,
      annualizedTakeRate: 0,
      assetStakedInAlliance: 0,
    }

    setAllianceAssets((cur) => {
      const newId = Date.now().valueOf()
      return {
        ...cur,
        [newId]: {
          name: asset,
          inputValues: newAsset,
        },
      }
    })
  }

  function removeAllianceAsset(id: number) {
    if (!allianceAssets[id]) return
    const newState = { ...allianceAssets }
    delete newState[id]
    setAllianceAssets(newState)
  }

  // render

  return (
    <AppStateProvider
      value={{
        allianceAssets,
        addAllianceAsset,
        removeAllianceAsset,
        poolTotalValue,
        nativeInputValues,
        handleNativeInputChange,
        handleAllianceInputChange,
        setAllianceAssets,
        setNativeInputValues,
        shareLink,
      }}
    >
      {children}
    </AppStateProvider>
  )
}

export default InitAppState
