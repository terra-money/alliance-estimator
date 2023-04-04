import { useEffect, useState } from 'react';
import Image from 'next/image';
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

  useEffect(() => {
    const content = document.getElementById(`content-${type === 'native' ? "" : assetId}-${index}`);
    if (content) {
      content.style.maxHeight = expanded ? `${content.scrollHeight + 24}px` : "0px";
    }
  }, [assetId, expanded, index, type])

  return (
    <div className={cardStyles.fieldSection}>
      <section
        className={`${cardStyles.accordion} ${expanded ? cardStyles.opened : ""}`}
        key={`accordion-${section}`}
      >
        <div
          className={cardStyles.top}
          onClick={handleHeaderClick}
        >
          <h5 className={cardStyles.title}>{section}</h5>
          <Image
            className={cardStyles.icon}
            src="/Icons/Chevron.svg"
            alt="icon"
            width={24}
            height={24}
          />
        </div>
        <div
          className={cardStyles.content}
          id={`content-${type === 'native' ? "" : assetId}-${index}`}
        >
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
      </section>
    </div>
  )
};

export default Card;
