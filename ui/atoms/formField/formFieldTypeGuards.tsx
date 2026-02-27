// react
import { isValidElement } from 'react';

// ui
import { LinkButtonProps } from '@/ui/atoms/formField/linkButton';
import { FormButtonProps } from '@/ui/atoms/formField/formButton';
import { FormCheckboxProps } from '@/ui/atoms/formField/formCheckbox';
import { FormHiddenProps } from '@/ui/atoms/formField/formHidden';
import { FormInputProps } from '@/ui/atoms/formField/formInput';
import { FormTextareaProps } from '@/ui/atoms/formField/formTextarea';
import { FormRadioProps } from '@/ui/atoms/formField/formRadio';
import { FormSelectProps } from '@/ui/atoms/formField/formSelect';

export function isLinkButtonFieldData(
  data: unknown
): data is LinkButtonProps['fieldData'] {
  if (typeof data === 'object' && data !== null) {
    const obj = data as { [key: string]: unknown };
    return typeof obj.href === 'string' && typeof obj.value === 'string';
  }
  return false;
}

export function isFormButtonFieldData(
  data: unknown
): data is FormButtonProps['fieldData'] {
  if (typeof data === 'object' && data !== null) {
    const obj = data as { [key: string]: unknown };
    return (
      typeof obj.id === 'string' &&
      (obj.type === 'button' ||
        obj.type === 'submit' ||
        obj.type === 'reset') &&
      typeof obj.value === 'string'
    );
  }
  return false;
}

export function isFormCheckboxFieldData(
  data: unknown
): data is FormCheckboxProps['fieldData'] {
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.id === 'string' &&
      (typeof obj.label === 'string' || isValidElement(obj.label))
    );
  }
  return false;
}

export function isFormHiddenFieldData(
  data: unknown
): data is FormHiddenProps['fieldData'] {
  if (typeof data === 'object' && data !== null) {
    const obj = data as { [key: string]: unknown };
    return (
      typeof obj.id === 'string' &&
      (typeof obj.value === 'string' || obj.value === undefined)
    );
  }
  return false;
}

export function isFormInputFieldData(
  data: unknown
): data is FormInputProps['fieldData'] {
  if (typeof data === 'object' && data !== null) {
    const obj = data as { [key: string]: unknown };
    return (
      typeof obj.id === 'string' &&
      typeof obj.type === 'string' &&
      typeof obj.label === 'string'
    );
  }
  return false;
}

export function isFormTextareaFieldData(
  data: unknown
): data is FormTextareaProps['fieldData'] {
  if (typeof data === 'object' && data !== null) {
    const obj = data as { [key: string]: unknown };
    return (
      typeof obj.id === 'string' &&
      typeof obj.type === 'string' &&
      typeof obj.label === 'string'
    );
  }
  return false;
}

export function isFormRadioFieldData(
  data: unknown
): data is FormRadioProps['fieldData'] {
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.groupName === 'string' &&
      Array.isArray(obj.radios) &&
      obj.radios.every(
        (radio: unknown) =>
          typeof radio === 'object' &&
          radio !== null &&
          typeof (radio as Record<string, unknown>).id === 'string' &&
          typeof (radio as Record<string, unknown>).label === 'string' &&
          typeof (radio as Record<string, unknown>).value === 'string'
      )
    );
  }
  return false;
}

export function isFormSelectFieldData(
  data: unknown
): data is FormSelectProps['fieldData'] {
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.id === 'string' &&
      typeof obj.label === 'string' &&
      Array.isArray(obj.options) &&
      obj.options.every(
        (option: unknown) =>
          typeof option === 'object' &&
          option !== null &&
          typeof (option as Record<string, unknown>).id === 'string' &&
          typeof (option as Record<string, unknown>).value === 'string'
      )
    );
  }
  return false;
}
