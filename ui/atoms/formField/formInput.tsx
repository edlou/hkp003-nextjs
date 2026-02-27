export type FormInputProps = {
  fieldData: {
    id: string;
    type: string;
    label: string;
    value?: string;
    placeholder?: string;
    maxLength?: number;
    className?: string;
    isRequired?: boolean;
    isError?: boolean;
    helper?: string;
    onChange?: () => void;
    onBlur?: () => void;
  };
};

export default function FormInput({fieldData}: FormInputProps) {
  const classes = ['formInput'];
  if (fieldData.className) classes.push(fieldData.className);
  if (fieldData.isError) classes.push('formError');
  if (fieldData.isRequired) classes.push('formRequired');

  return (
    <div className={classes.join(' ')}>
      <label htmlFor={fieldData.id}>{fieldData.label}</label>
      <input
        type={fieldData.type}
        name={fieldData.id}
        id={fieldData.id}
        defaultValue={fieldData.value ?? undefined}
        placeholder={fieldData.placeholder ?? undefined}
        maxLength={fieldData.maxLength ?? undefined}
        onChange={fieldData.onChange}
        onBlur={fieldData.onBlur}
      />
      {fieldData.helper && <small className="helper">{fieldData.helper}</small>}
    </div>
  );
}
