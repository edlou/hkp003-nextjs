/*
  USAGE:
  ===========
  <FormField type='select' fieldData={{
    label: 'State',                             @required
    id: 'id_state',                             @required
    wrapperClassName: 'flex flex-col',          @optional | @default: 'flex flex-col'
    className: 'border p-2 w-full',             @optional | @default: 'border p-2 w-full'
    selectedID: 'id_ca',                        @optional
    isRequired: false,                          @optional | @options: true | false
    isError: false,                             @optional | @default: true | false
    helper: 'Select one option',                @optional
    options: [{                                 @optional
      value: 'AK',                              @required
      id: 'id_ak'                               @required
    }, {
      value: 'CA',                              @required
      id: 'id_ca'                               @required
    }]
  }} />
*/

export type FormSelectProps = {
  fieldData: {
    id: string;
    label: string;
    options: {
      id: string;
      value: string;
    }[];
    selectedID?: string;
    className?: string;
    isRequired?: boolean;
    isError?: boolean;
    helper?: string;
    onChange?: () => void;
  };
};

export default function FormSelect({fieldData}: FormSelectProps) {
  const classes = ['formSelect'];
  if (fieldData.className) classes.push(fieldData.className);
  if (fieldData.isError) classes.push('formError');
  if (fieldData.isRequired) classes.push('formRequired');

  const optionsData = fieldData.options;

  return (
    <div className={classes.join(' ')}>
      <label htmlFor={fieldData.id}>{fieldData.label}:</label>
      <select
        name={fieldData.id}
        id={fieldData.id}
        defaultValue={fieldData.selectedID ?? undefined}
        onChange={fieldData.onChange}
      >
        {optionsData.map((optionData) => (
          <option key={optionData.id} value={optionData.id}>{optionData.value}</option>
        ))}
      </select>
      {fieldData.helper && <small className="helper">{fieldData.helper}</small>}
    </div>
  );
}
