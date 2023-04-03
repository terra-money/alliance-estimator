import { ReactNode, useState } from "react";
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
  poolTotalValueState: number;
  updatePoolTotalValue: (asset: string, value: number) => void;
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
      annualizedTakeRate: 0,
      denom: "Luna",
    }
  );
  const [allianceAssets, setAllianceAssets] = useState<AllianceAssets>(
    {
      0: {
        name: "WHALELSD",
        inputValues: {
          inflationRate: 0,
          lsdApr: 0,
          totalTokenSupply: 0,
          assetPrice: 0,
          allianceRewardWeight: 0,
          annualizedTakeRate: 0,
          principalStakeOnNativeChain: 0,
        },
      },
    }
    // { id: 1, label: "KUJILSD" },
    // { id: 2, label: "OSMOLSD" },
    // { id: 3, label: "OSMOLSD2" },
  );
  const [poolValues, setPoolValues] = useState<Record<string, number>>({});
  const [poolTotalValueState, setPoolTotalValue] = useState<number>(0);

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

  function totalPoolValues() {
    let totalPoolValues = 0;
    Object.keys(poolValues).forEach((key) => {
      totalPoolValues += poolValues[key];
    });
    setPoolTotalValue(totalPoolValues);
  }

  function updatePoolTotalValue(asset: string, value: number) {
    setPoolValues((cur) => ({ ...cur, [asset]: value }));
    totalPoolValues();
  }

  function addAllianceAsset(asset: string) {
    const newAsset = {
      inflationRate: 0,
      lsdApr: 0,
      totalTokenSupply: 0,
      assetPrice: 0,
      allianceRewardWeight: 0,
      annualizedTakeRate: 0,
      principalStakeOnNativeChain: 0,
    };

    setAllianceAssets((cur) => {
      const newId = Object.keys(cur).length;
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
        poolTotalValueState,
        updatePoolTotalValue,
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
