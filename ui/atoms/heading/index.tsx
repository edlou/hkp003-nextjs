// react
import type {JSX} from 'react';

// styles
import '@/ui/atoms/heading/styles.css';

// type
type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function Heading({
  level,
  id,
  className,
  children,
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  );
}
