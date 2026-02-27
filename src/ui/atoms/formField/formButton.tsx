// nextjs
import Image from 'next/image';

export type FormButtonProps = {
  fieldData: {
    id: string;
    type: 'button' | 'submit' | 'reset';
    value: string;
    className?: string;
    isDisabled?: boolean;
    image?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
    onClick?: () => void;
  };
};

export default function FormButton({fieldData, ...rest}: FormButtonProps) {
  const classes = ['formButton'];
  if (fieldData.className) classes.push(fieldData.className);

  return (
    <button
      type={fieldData.type}
      name={fieldData.id}
      value={fieldData.value}
      className={classes.join(' ')}
      id={fieldData.id}
      disabled={(fieldData.isDisabled) ? fieldData.isDisabled : false}
      onClick={fieldData.onClick}
      {...rest}>{fieldData.value}
      {(() => {
        return (fieldData.image) ? <Image src={fieldData.image.src} alt={fieldData.image.alt} width={fieldData.image.width} height={fieldData.image.height} priority={true} /> : null;
      })()}
    </button>
  );
}
