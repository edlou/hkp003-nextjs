export type FormTextareaProps = {
  fieldData: {
    id: string;
    type: string;
    label: string;
    value?: string;
    placeholder?: string;
    className?: string;
    isRequired?: boolean;
    isError?: boolean;
    helper?: string;
    onChange?: () => void;
    onBlur?: () => void;
  };
};

export default function FormTextarea({ fieldData }: FormTextareaProps) {
  const classes = ['formTextarea'];
  if (fieldData.className) classes.push(fieldData.className);
  if (fieldData.isError) classes.push('formError');
  if (fieldData.isRequired) classes.push('formRequired');

  return (
    <div className={classes.join(' ')}>
      <label htmlFor={fieldData.id}>{fieldData.label}</label>
      <textarea
        name={fieldData.id}
        id={fieldData.id}
        placeholder={fieldData.placeholder ?? undefined}
        onChange={fieldData.onChange}
        onBlur={fieldData.onBlur}
      >
        {fieldData.value ?? undefined}
      </textarea>
      {fieldData.helper && <small className="helper">{fieldData.helper}</small>}
    </div>
  );
}
