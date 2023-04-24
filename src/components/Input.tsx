import { useForm, SubmitHandler } from "react-hook-form";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const isExample = location.pathname === "/mock-data";

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<any> = data => {
    onChange(data)
  };

  return (
    <div className={inputStyles.inputGroup}>
      {field.inputPrefix && (
        <div className={inputStyles.inputPrefix}>{field.inputPrefix}</div>
      )}
      <form onChange={handleSubmit(onSubmit)} onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register(field.name, { required: true })}
          className={`
            ${inputStyles.input}
            ${field.inputPrefix && inputStyles.withPrefix}
            ${field.inputSuffix && inputStyles.withSuffix}
            ${errors[field.name] ? inputStyles.error : ''}
          `}
          autoComplete="off"
          type="text"
          placeholder="0"
          name={field.name}
          disabled={!field.input}
          defaultValue={isExample ? value : ""}
        />
      </form>
      {field.inputSuffix && (
        <div className={inputStyles.inputSuffix}>{field.inputSuffix}</div>
      )}
    </div>
  );
}

export default Input;
