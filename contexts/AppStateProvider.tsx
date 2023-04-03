import { ReactNode, useState } from "react";
import { createContext } from "@/utils";

interface AllianceAsset {
  id: number;
  label: string;
}

export interface IAppState {
  allianceAssets: AllianceAsset[];
  addAllianceAsset: (asset: string) => void;
  removeAllianceAsset: (index: number) => void;
  poolTotalValueState: number;
  updatePoolTotalValue: (asset: string, value: number) => void;
}

export const [useAppState, AppStateProvider] =
  createContext<IAppState>("useAppState");

export function InitAppState({ children }: { children: ReactNode }) {
  const [allianceAssets, setAllianceAssets] = useState<AllianceAsset[]>([
    { id: 0, label: "WHALELSD" },
    // { id: 1, label: "KUJILSD" },
    // { id: 2, label: "OSMOLSD" },
    // { id: 3, label: "OSMOLSD2" },
  ]);
  const [poolValues, setPoolValues] = useState<Record<string, number>>({});

  const [poolTotalValueState, setPoolTotalValue] = useState<number>(0);

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
    setAllianceAssets((cur) => [...cur, { id: cur.length + 1, label: asset }]);
  }

  function removeAllianceAsset(id: number) {
    let newPoolValues = { ...poolValues };
    if (allianceAssets[id]) {
      delete newPoolValues[allianceAssets[id].label];
      setPoolValues(newPoolValues);
    }

    totalPoolValues();
    setAllianceAssets((cur) => cur.filter((asset) => asset.id !== id));
  }

  return (
    <AppStateProvider
      value={{
        allianceAssets,
        addAllianceAsset,
        removeAllianceAsset,
        poolTotalValueState,
        updatePoolTotalValue,
      }}
    >
      {children}
    </AppStateProvider>
  );
}

export default InitAppState;
