export type FormCheckboxProps = {
  fieldData: {
    id: string;
    value: string;
    label: string | React.ReactNode;
    className?: string;
    isRequired?: boolean;
    isError?: boolean;
    isChecked?: boolean;
    isDisabled?: boolean;
    helper?: string;
    onChange?: () => void;
  };
};

export default function FormInput({fieldData}: FormCheckboxProps) {
  const classes = ['formCheckbox'];
  if (fieldData.className) classes.push(fieldData.className);
  if (fieldData.isError) classes.push('formError');
  if (fieldData.isRequired) classes.push('formRequired');

  return (
    <div className={classes.join(' ')}>
      <input
        type="checkbox"
        name={fieldData.id}
        id={fieldData.id}
        checked={!!fieldData.isChecked}
        disabled={!!fieldData.isDisabled}
        onChange={fieldData.onChange}
      />
      <label htmlFor={fieldData.id}>{fieldData.label}</label>
      {fieldData.helper && <small className="helper">{fieldData.helper}</small>}
    </div>
  );
}
