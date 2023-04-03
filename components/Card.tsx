import {
  nativeFieldMap,
  NativeFieldKey,
  NativeCalculatedValues,
  NativeInputValues,
  allianceFieldMap,
  AllianceFieldKey,
  AllianceCalculatedValues,
  AllianceInputValues,
} from "@/data";
import cardStyles from "../styles/Card.module.scss";

type InputValues = AllianceInputValues | NativeInputValues;
type CalculatedValues = AllianceCalculatedValues | NativeCalculatedValues;
type FieldKeys = AllianceFieldKey | NativeFieldKey;

const Card = ({
  section,
  type,
  userInputValues,
  handleInputChange,
  derivedValues,
  index,
}: {
  section: string;
  type: string;
  userInputValues: InputValues;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  derivedValues: CalculatedValues;
  index: number;
}) => {
  const fields = type === "native" ? nativeFieldMap : allianceFieldMap;

  function isDerivedField(key: FieldKeys): key is keyof CalculatedValues {
    return key in derivedValues;
  }

  function isInputField(key: FieldKeys): key is keyof InputValues {
    return key in userInputValues;
  }

  return (
    <div className={cardStyles.fieldSection}>
      <div className={cardStyles.fieldSectionHeader}>
        <h3 className={cardStyles.fieldSectionTitle}>{section}</h3>
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
                    isInputField(field.name) ? userInputValues[field.name] : ""
                  }
                  onChange={handleInputChange}
                  disabled={!field.input}
                />
              ) : (
                <div className={cardStyles.textValue}>
                  {isDerivedField(field.name)
                    ? derivedValues[field.name].toFixed(2)
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
