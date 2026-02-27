export type FormRadioProps = {
  fieldData: {
    groupName: string;
    groupLabel?: string;
    radios: {
      id?: string;
      className?: string;
      label: string;
      value: string;
      isChecked?: boolean;
      isDisabled?: boolean;
    }[];
    id: string;
    className?: string;
    isRequired?: boolean;
    isError?: boolean;
    helper?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

export default function FormRadio({fieldData}: FormRadioProps) {
  const classes = ['formRadio'];
  if (fieldData.className) classes.push(fieldData.className);
  if (fieldData.isError) classes.push('formError');
  if (fieldData.isRequired) classes.push('formRequired');

  const radiosData = fieldData.radios;

  return (
    <fieldset className={classes.join(' ')} id={fieldData.id}>
      {fieldData.groupLabel && <legend>{fieldData.groupLabel}</legend>}
      <div>
        {radiosData.map((radioData) => (
          <div key={radioData.id} className={(radioData.isDisabled) ? ' isDisabled' : ''}>
            <input
              type="radio"
              name={fieldData.groupName}
              id={radioData.id}
              defaultValue={radioData.value}
              checked={!!radioData.isChecked}
              disabled={radioData.isDisabled}
              onChange={fieldData.onChange}
            />
            <label
              htmlFor={radioData.id}
              className={radioData.className}
            >{radioData.label}</label>
          </div>
        ))}
      </div>
      {fieldData.helper && <small className="helper">{fieldData.helper}</small>}
    </fieldset>
  );
}
