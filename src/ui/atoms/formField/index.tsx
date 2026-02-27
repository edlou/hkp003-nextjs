// styles
import '@/ui/atoms/formField/styles.css';

// ui
import LinkButton from '@/ui/atoms/formField/linkButton';
import FormButton from '@/ui/atoms/formField/formButton';
import FormCheckbox from '@/ui/atoms/formField/formCheckbox';
import FormHidden from '@/ui/atoms/formField/formHidden';
import FormInput from '@/ui/atoms/formField/formInput';
import FormTextarea from '@/ui/atoms/formField/formTextarea';
import FormRadio from '@/ui/atoms/formField/formRadio';
import FormSelect from '@/ui/atoms/formField/formSelect';

// ui guards
import {
  isLinkButtonFieldData,
  isFormButtonFieldData,
  isFormCheckboxFieldData,
  isFormHiddenFieldData,
  isFormInputFieldData,
  isFormTextareaFieldData,
  isFormRadioFieldData,
  isFormSelectFieldData,
} from '@/ui/atoms/formField/formFieldTypeGuards';

interface FormFieldProps {
  type: string;
  fieldData: unknown;
}

export default function FormField({
  type,
  fieldData,
  ...rest
}: FormFieldProps) {
  return (
    <>
      {(() => {
        switch (type) {
          case 'linkButton':
            if (isLinkButtonFieldData(fieldData)) {
              return <LinkButton fieldData={fieldData} {...rest} />;
            } else {
              return <p>Error: Invalid button data</p>;
            }
          case 'button':
            if (isFormButtonFieldData(fieldData)) {
              return <FormButton fieldData={fieldData} {...rest} />;
            } else {
              return <p>Error: Invalid button data</p>;
            }
          case 'textarea':
            if (isFormTextareaFieldData(fieldData)) {
              return <FormTextarea fieldData={fieldData} {...rest} />;
            } else {
              return <p>Error: Invalid textarea data</p>;
            }
          case 'checkbox':
            if (isFormCheckboxFieldData(fieldData)) {
              return <FormCheckbox fieldData={fieldData} {...rest} />;
            } else {
              return <p>Error: Invalid checkbox data</p>;
            }
          case 'hidden':
            if (isFormHiddenFieldData(fieldData)) {
              return <FormHidden fieldData={fieldData} {...rest} />;
            } else {
              return <p>Error: Invalid hidden data</p>;
            }
          case 'radio':
            if (isFormRadioFieldData(fieldData)) {
              return <FormRadio fieldData={fieldData} {...rest} />;
            } else {
              return <p>Error: Invalid radio data</p>;
            }
          case 'select':
            if (isFormSelectFieldData(fieldData)) {
              return <FormSelect fieldData={fieldData} {...rest} />;
            } else {
              return <p>Error: Invalid select data</p>;
            }
          default:
            if (isFormInputFieldData(fieldData)) {
              return <FormInput fieldData={fieldData} {...rest} />;
            } else {
              return <p>Error: Invalid input data</p>;
            }
        }
      })()}
    </>
  );
}
