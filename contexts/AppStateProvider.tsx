import { ReactNode, useState, useMemo } from "react";
import { createContext } from "@/utils";
import {
  NativeInputValues,
  AllianceInputValues,
  InputValues,
  isDerivedField,
  isInputField,
} from "@/data";

interface AllianceAssets {
  [id: number]: {
    name: string;
    inputValues: AllianceInputValues;
  };
}

export interface IAppState {
  allianceAssets: AllianceAssets;
  addAllianceAsset: (asset: string) => void;
  removeAllianceAsset: (index: number) => void;
  poolTotalValue: number;
  nativeInputValues: NativeInputValues;
  handleNativeInputChange: (
    fieldName: keyof NativeInputValues,
    value: string | number
  ) => void;
  handleAllianceInputChange: (
    fieldId: number,
    fieldName: keyof AllianceInputValues,
    value: string | number
  ) => void;
}

export const [useAppState, AppStateProvider] =
  createContext<IAppState>("useAppState");

export function InitAppState({ children }: { children: ReactNode }) {
  // state
  const [nativeInputValues, setNativeInputValues] = useState<NativeInputValues>(
    {
      inflationRate: 0.07,
      lsdApr: 0,
      principalStakeOnNativeChain: 527724946,
      totalTokenSupply: 1073271122,
      assetPrice: 1.3,
      allianceRewardWeight: 1,
      denom: "Luna",
    }
  );
  const [allianceAssets, setAllianceAssets] = useState<AllianceAssets>({
    0: {
      name: "WHALELSD",
      inputValues: {
        lsdApr: 0.16,
        assetPrice: 0.015,
        allianceRewardWeight: 0.001,
        annualizedTakeRate: 0.16,
        principalStakeOnNativeChain: 10000000,
      },
    },
    1: {
      name: "KUJILSD",
      inputValues: {
        lsdApr: 0.16,
        assetPrice: 0.424,
        allianceRewardWeight: 0.01,
        annualizedTakeRate: 0.11,
        principalStakeOnNativeChain: 9000000,
      },
    },
    2: {
      name: "OSMOLSD",
      inputValues: {
        lsdApr: 0.22,
        assetPrice: 0.819,
        allianceRewardWeight: 0.04,
        annualizedTakeRate: 0.22,
        principalStakeOnNativeChain: 19000000,
      },
    },
  });

  const poolTotalValue = useMemo(() => {
    let allianceAssetValue = 0;
    let nativeAssetValue = 0;
    Object.values(allianceAssets).forEach((asset) => {
      const inputValues = asset.inputValues;

      allianceAssetValue +=
        inputValues.principalStakeOnNativeChain *
          inputValues.annualizedTakeRate *
          inputValues.assetPrice +
        inputValues.principalStakeOnNativeChain *
          inputValues.annualizedTakeRate *
          inputValues.lsdApr *
          inputValues.assetPrice;
    });

    nativeAssetValue =
      Number(nativeInputValues.totalTokenSupply) *
        Number(nativeInputValues.inflationRate) *
        Number(nativeInputValues.assetPrice) +
      Number(nativeInputValues.totalTokenSupply) *
        Number(nativeInputValues.inflationRate) *
        0 *
        Number(nativeInputValues.assetPrice);

    return allianceAssetValue + nativeAssetValue;
  }, [
    allianceAssets,
    nativeInputValues.assetPrice,
    nativeInputValues.inflationRate,
    nativeInputValues.totalTokenSupply,
  ]);

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
      });
    }
  };

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
      });
    }
  };

  function addAllianceAsset(asset: string) {
    const newAsset = {
      lsdApr: 0,
      assetPrice: 0,
      allianceRewardWeight: 0,
      annualizedTakeRate: 0,
      principalStakeOnNativeChain: 0,
    };

    setAllianceAssets((cur) => {
      const newId = Date.now().valueOf();
      return {
        ...cur,
        [newId]: {
          name: asset,
          inputValues: newAsset,
        },
      };
    });
  }

  function removeAllianceAsset(id: number) {
    if (!allianceAssets[id]) return;
    const newState = { ...allianceAssets };
    delete newState[id];
    setAllianceAssets(newState);
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
      }}
    >
      {children}
    </AppStateProvider>
  );
}

export default InitAppState;
