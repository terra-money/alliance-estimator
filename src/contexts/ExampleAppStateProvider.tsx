import { type ReactNode, useState, useMemo } from "react";
import { createContext } from "utils";
import {
  type NativeInputValues,
  type AllianceInputValues,
  isInputField,
} from "data";
import { MOCK_DATA } from '../constants';

type AllianceAssets = Record<
  number,
  {
    name: string;
    inputValues: AllianceInputValues;
  }
>;

export interface IAppState {
  allianceAssets: AllianceAssets;
  addAllianceAsset: (asset: string) => void;
  removeAllianceAsset: (index: number) => void;
  poolTotalValue: number;
  exampleNativeInputValues: NativeInputValues;
  handleNativeInputChange: (
    fieldName: keyof NativeInputValues,
    value: string | number
  ) => void;
  handleAllianceInputChange: (
    fieldId: number,
    fieldName: keyof AllianceInputValues,
    value: string | number
  ) => void;
  setAllianceAssets: (newAssets: AllianceAssets) => void;
  setExampleNativeInputValues: (newValues: NativeInputValues) => void;
}

export const [useExampleAppState, ExampleAppStateProvider] =
  createContext<IAppState>("useExampleAppState");

export function ExampleAppState({ children }: { children: ReactNode }) {
  // state
  const [exampleNativeInputValues, setExampleNativeInputValues] = useState<NativeInputValues>(
    {
      columnName: "Native Asset",
      inflationRate: 7, // Chain Data - Annual Inflation Rate
      lsdAnnualEstimate: 0, // Chain Data - Annual Estimated LSD Growth Rate
      totalTokenSupply: 1073271122, // Chain Data - Total Token Supply
      assetPrice: 1.3, // Chain Data - Asset Price
      allianceRewardWeight: 1, // Alliance Asset Parameters - Alliance Reward Weight
      assetStakedInAlliance: 527724946, // Reward Pool - Asset Staked in Alliance
      denom: "LUNA",
    }
  );
  const [allianceAssets, setAllianceAssets] = useState<AllianceAssets>(MOCK_DATA);

  const poolTotalValue = useMemo(() => {
    let allianceAssetValue = 0;
    let nativeAssetValue = 0;
    Object.values(allianceAssets).forEach(
      (asset: { name: string; inputValues: AllianceInputValues }) => {
        const inputValues = asset.inputValues;
        allianceAssetValue +=
          inputValues.assetStakedInAlliance *
            (inputValues.annualizedTakeRate / 100) *
            inputValues.assetPrice +
          inputValues.assetStakedInAlliance *
            (inputValues.annualizedTakeRate / 100) *
            (inputValues.lsdAnnualEstimate / 100) *
            inputValues.assetPrice;
      }
    );

    nativeAssetValue =
      exampleNativeInputValues.totalTokenSupply *
        (exampleNativeInputValues.inflationRate / 100) *
        exampleNativeInputValues.assetPrice +
      exampleNativeInputValues.totalTokenSupply *
        (exampleNativeInputValues.inflationRate / 100) *
        0 *
        exampleNativeInputValues.assetPrice;

    return allianceAssetValue + nativeAssetValue;
  }, [
    allianceAssets,
    exampleNativeInputValues.assetPrice,
    exampleNativeInputValues.inflationRate,
    exampleNativeInputValues.totalTokenSupply,
  ]);

  // handlers
  // native input update handler
  const handleNativeInputChange = (
    fieldName: keyof NativeInputValues,
    value: string | number
  ) => {
    if (isInputField(fieldName, exampleNativeInputValues)) {
      setExampleNativeInputValues({
        ...exampleNativeInputValues,
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
    const newAsset: AllianceInputValues = {
      lsdAnnualEstimate: 0,
      assetPrice: 0,
      allianceRewardWeight: 0,
      annualizedTakeRate: 0,
      assetStakedInAlliance: 0,
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
    <ExampleAppStateProvider
      value={{
        allianceAssets,
        addAllianceAsset,
        removeAllianceAsset,
        poolTotalValue,
        exampleNativeInputValues,
        handleNativeInputChange,
        handleAllianceInputChange,
        setAllianceAssets,
        setExampleNativeInputValues,
      }}
    >
      {children}
    </ExampleAppStateProvider>
  );
}

export default ExampleAppState;
