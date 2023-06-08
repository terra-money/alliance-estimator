import { useEffect } from 'react';
import {
  nativeFieldMap,
  NativeInputValues,
  allianceFieldMap,
  AllianceInputValues,
  InputValues,
  CalculatedValues,
  isInputField,
  isDerivedField,
  NativeField,
  AllianceField,
} from "data";
import { useAppState } from "contexts";
import cardStyles from "../styles/Card.module.scss";
import { Input } from "components";
import { useLocation } from 'react-router-dom';
import { useExampleAppState } from 'contexts/ExampleAppStateProvider';

const Card = ({
  section,
  type,
  userInputValues,
  derivedValues,
  assetId,
  index,
  toggleExpansion,
  expanded,
  moreInputRequiredFields,
}: {
  assetId?: number;
  section: string;
  type: string;
  userInputValues: InputValues;
  derivedValues: CalculatedValues;
  index: number;
  toggleExpansion: (index: number) => void;
  expanded: boolean;
  moreInputRequiredFields?: string[];
}) => {
  const location = useLocation();
  const isExample = location.pathname === "/mock-data";
  const {
    handleNativeInputChange: standardHandleNativeInputChange,
    handleAllianceInputChange: standardHandleAllianceInputChange,
  } = useAppState();

  const {
    handleNativeInputChange: exampleHandleNativeInputChange,
    handleAllianceInputChange: exampleHandleAllianceInputChange,
  } = useExampleAppState();

  const handleNativeInputChange = isExample
    ? exampleHandleNativeInputChange
    : standardHandleNativeInputChange;

  const handleAllianceInputChange = isExample
    ? exampleHandleAllianceInputChange
    : standardHandleAllianceInputChange;

  const fields = type === "native" ? nativeFieldMap : allianceFieldMap;

  function formatValue(
    value: string | number,
    field: AllianceField | NativeField
  ): string {
    if (field.format) {
      if (isNaN(+value)) return "--";
      return field.format(+value);
    }
    return value?.toLocaleString();
  }

  function handleHeaderClick() {
    toggleExpansion(index);
  }

  function handleInputUpdate(data: any) {
    const dataKey = Object.keys(data)[0];
    if (type === "native") {
      handleNativeInputChange(
        dataKey as keyof NativeInputValues,
        data[dataKey].replace(/[,$]/g, "")
      );
    } else {
      if (assetId === undefined) return;
      const value = data[dataKey].replace(/[,$]/g, "");

      handleAllianceInputChange(
        assetId,
        dataKey as keyof AllianceInputValues,
        value
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
          <img
            className={cardStyles.icon}
            src="/Icons/Chevron.svg"
            alt="icon"
            width={18}
            height={18}
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
                  <Input
                    field={field}
                    value={
                      isInputField(field.name, userInputValues)
                        ? userInputValues[field.name]
                        : ""
                    }
                    onChange={handleInputUpdate}
                  />
                ) : (
                  <div className={cardStyles.textValue}>
                    {moreInputRequiredFields?.includes(field.name) ? (
                      <span>Fill in all fields</span>
                    ) : (
                      isDerivedField(field.name, derivedValues)
                        ? formatValue(derivedValues[field.name], field)
                        : ""
                    )}
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
