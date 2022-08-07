import { createUseStyles } from 'react-jss';
import cx from 'classnames';

type Props = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

export function Tag(p: Props) {
  const s = useStyles();
  return (
    <div className={cx(s.tag, p.className)} style={p.style}>
      {p.text}
    </div>
  );
}

const useStyles = createUseStyles({
  tag: {
    ':where(&)': {
      display: 'inline-block',
      borderRadius: '3px',
      border: '1px solid #f5f5f5',
      boxShadow: '0px 1px 1px #0003',
      padding: '3px 5px',
      background: 'linear-gradient(to bottom, #f5f5f5 0%,#efefe5 100%)',
      color: '#666',
      fontSize: '12px',
    }
  }
});