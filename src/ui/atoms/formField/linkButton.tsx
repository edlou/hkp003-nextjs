// nextjs
import Image from 'next/image';
import Link from 'next/link';

export type LinkButtonProps = {
  fieldData: {
    href: string;
    value: string;
    target?: string;
    id?: string;
    className?: string;
    image?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
    onClick?: () => void;
  };
};

export default function LinkButton({fieldData, ...rest}: LinkButtonProps) {
  const classes = ['formButton'];
  if (fieldData.className) classes.push(fieldData.className);

  return (
    <Link
      href={fieldData.href}
      target={fieldData.target}
      className={classes.join(' ')}
      id={fieldData.id}
      onClick={fieldData.onClick}
      {...rest}>{fieldData.value}
      {(() => {
        return (fieldData.image) ? <Image src={fieldData.image.src} alt={fieldData.image.alt} width={fieldData.image.width} height={fieldData.image.height} priority={true} /> : null;
      })()}
    </Link>
  );
}
