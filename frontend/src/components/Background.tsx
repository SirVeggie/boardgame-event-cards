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
    <div className={cx(s.bg, s.values, p.className)} style={p.style} />
  );
}

const useStyles = createUseStyles({
  bg: {
    position: 'fixed',
    zIndex: -1,
    top: 0,
    left: 0,
    background: 'var(--bg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100vw',
    height: '100vh',
  },
  
  values: (p: Props) => ({
    '--bg': p.bg ?? '#0000',
  }),
});