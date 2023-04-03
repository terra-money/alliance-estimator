import {
  nativeFieldMap,
  NativeFieldKey,
  NativeCalculatedValues,
  NativeInputValues,
  allianceFieldMap,
  AllianceFieldKey,
  AllianceCalculatedValues,
  AllianceInputValues
} from "@/data";
import cardStyles from "../styles/Card.module.scss";

const Card = ({
  section,
  type,
  values,
  handleInputChange,
  isDerivedField,
  derivedValues,
}: {
  section: string
  type: string
  values: NativeInputValues | AllianceInputValues
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  // isDerivedField:
  //   (key: NativeFieldKey | AllianceFieldKey) => key is any
  // derivedValues: NativeCalculatedValues | AllianceCalculatedValues
  isDerivedField: any
  derivedValues: any
}) => {
  const fields = type === "native" ? nativeFieldMap : allianceFieldMap;

  return (
    <div className={cardStyles.fieldSection}>
      <h3 className={cardStyles.fieldSectionHeader}>{section}</h3>
      <div className={cardStyles.inputs}>
        {fields[section].map((field, i) => (
          <div
            className={`${cardStyles.fieldRow}`}
            key={field.name}
          >
            <div className={cardStyles.labelContainer}>
              <div className={cardStyles.fieldLabel}>{field.label}:</div>
              <div className={cardStyles.secondaryLabel}>{field.secondaryLabel}</div>
            </div>
            <div className={cardStyles.fieldValue}>
              {field.input ? (
                <input
                  type="number"
                  name={field.name}
                  value={
                    field.input
                      ? values[field.name as keyof NativeInputValues]
                      : isDerivedField(field.name)
                      ? derivedValues[field.name].toFixed(2)
                      : ""
                  }
                  onChange={handleInputChange}
                  disabled={!field.input}
                />
              ) : (
                <div className={cardStyles.textValue}>{
                  isDerivedField(field.name) ?
                  derivedValues[field.name].toFixed(2)
                  : ""
                }</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Card;