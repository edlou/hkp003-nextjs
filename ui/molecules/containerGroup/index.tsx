// react
import type {ReactNode} from 'react';

// styles
import '@/ui/molecules/containerGroup/styles.css';

// type
export type ContainerGroupProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export default function ContainerGroup({
  children,
  className,
  id,
}: ContainerGroupProps) {
  const classes = ['containerGroup'];
  if (className) classes.push(className);

  return (
    <div className={classes.join(' ')} id={id}>{children}</div>
  );
}
