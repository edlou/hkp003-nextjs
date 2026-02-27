// react
import type {ReactNode} from 'react';

// styles
import '@/ui/molecules/container/styles.css';

// type
export type ContainerProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export default function Container({
  children,
  className,
  id,
}: ContainerProps) {
  const classes = ['container'];
  if (className) classes.push(className);

  return (
    <section className={classes.join(' ')} id={id}>{children}</section>
  );
}
