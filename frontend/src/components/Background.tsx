import { createUseStyles } from 'react-jss';
import cx from 'classnames';

type Props = {
  bg: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export function Background(p: Props) {
  const s = useStyles(p);

  return (
    <div className={cx(s.bg, p.className)} style={p.style} />
  );
}

const useStyles = createUseStyles({
  bg: (props: Props) => ({
    position: 'fixed',
    zIndex: -1,
    top: 0,
    left: 0,
    background: props.bg,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100vw',
    height: '100vh',
  }),
});