import { useState } from "react";
import {
  nativeFieldMap,
  NativeInputValues,
  allianceFieldMap,
  AllianceInputValues,
  InputValues,
  CalculatedValues,
  isInputField,
  isDerivedField,
} from "@/data";
import { useAppState } from "@/contexts";
import cardStyles from "../styles/Card.module.scss";

const Card = ({
  section,
  type,
  userInputValues,
  derivedValues,
  assetId,
  index,
  toggleExpansion,
  expanded,
}: {
  assetId?: number;
  section: string;
  type: string;
  userInputValues: InputValues;
  derivedValues: CalculatedValues;
  index: number;
  toggleExpansion: (index: number) => void;
  expanded: boolean;
}) => {
  const { handleNativeInputChange, handleAllianceInputChange } = useAppState();
  const fields = type === "native" ? nativeFieldMap : allianceFieldMap;

  function handleHeaderClick() {
    toggleExpansion(index);
  }

  function handleInputUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    if (type === "native") {
      handleNativeInputChange(
        e.target.name as keyof NativeInputValues,
        e.target.value
      );
    } else {
      if (assetId === undefined) return;
      handleAllianceInputChange(
        assetId,
        e.target.name as keyof AllianceInputValues,
        e.target.value
      );
    }
  }

  return (
    <div
      className={`${cardStyles.fieldSection} ${
        expanded && cardStyles.expanded
      }`}
    >
      <div
        className={cardStyles.fieldSectionHeader}
        onClick={handleHeaderClick}
      >
        <h3 className={cardStyles.fieldSectionTitle}>{section}</h3>
        <div>{expanded ? "^" : "v"}</div>
      </div>
      <div className={cardStyles.inputs}>
        {fields[section].map((field, i) => (
          <div className={`${cardStyles.fieldRow}`} key={field.name}>
            <div className={cardStyles.labelContainer}>
              <div className={cardStyles.fieldLabel}>{field.label}:</div>
              <div className={cardStyles.secondaryLabel}>
                {field.secondaryLabel}
              </div>
            </div>
            <div className={cardStyles.fieldValue}>
              {field.input ? (
                <input
                  type="text"
                  name={field.name}
                  value={
                    isInputField(field.name, userInputValues)
                      ? userInputValues[field.name]
                      : ""
                  }
                  onChange={handleInputUpdate}
                  disabled={!field.input}
                />
              ) : (
                <div className={cardStyles.textValue}>
                  {isDerivedField(field.name, derivedValues)
                    ? Number(derivedValues[field.name]).toFixed(2)
                    : ""}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
