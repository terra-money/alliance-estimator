import { NativeField, AllianceField } from "data";
import inputStyles from "../styles/Input.module.scss";

function Input({
  field,
  value,
  onChange,
}: {
  field: NativeField | AllianceField;
  value: number | string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className={inputStyles.inputGroup}>
      {field.inputPrefix && (
        <div className={inputStyles.inputPrefix}>{field.inputPrefix}</div>
      )}
      <input
        className={`${inputStyles.input} ${
          field.inputPrefix && inputStyles.withPrefix
        } ${field.inputSuffix && inputStyles.withSuffix}`}
        autoComplete="off"
        type="text"
        placeholder="0"
        name={field.name}
        value={value}
        onChange={onChange}
        disabled={!field.input}
      />
      {field.inputSuffix && (
        <div className={inputStyles.inputSuffix}>{field.inputSuffix}</div>
      )}
    </div>
  );
}

export default Input;
