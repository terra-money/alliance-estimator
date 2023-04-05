import {
  NativeFieldKey,
  NativeCalculatedValues,
  NativeInputValues,
  AllianceFieldKey,
  AllianceCalculatedValues,
  AllianceInputValues,
} from "@/data";

export type InputValues = AllianceInputValues | NativeInputValues;
export type CalculatedValues =
  | AllianceCalculatedValues
  | NativeCalculatedValues;
export type FieldKeys = AllianceFieldKey | NativeFieldKey;

export function isInputField(
  key: FieldKeys,
  userInputValues: InputValues
): key is keyof InputValues {
  return key in userInputValues;
}

export function isDerivedField(
  key: FieldKeys,
  derivedValues: CalculatedValues
): key is keyof CalculatedValues {
  return key in derivedValues;
}

export function currencyFormat(value: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function percentFormat(value: number) {
  return (value * 100).toFixed(4) + " %";
}
