import { createUseStyles } from 'react-jss';
import cx from 'classnames';
import { CardType } from 'shared';
import { CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { titleShade } from '../tools/cssConst';

type Props = {
  card: CardType;
  color?: string;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
};

export function Card(p: Props) {
  const game = useSelector((state: RootState) => state.games)
    .find(x => x.name === p.card.game);
  const s = useStyles({ ...p, color: p.color ?? game?.color ?? 'grey' });

  return (
    <div className={cx('card', s.card, p.className)} style={p.style}>
      <div className={s.titleBox}>
        <h1 className={s.title}>{p.card.title || '(Empty)'}</h1>
        <div className={s.type}>{p.card.type}</div>
      </div>
      <div className={s.inner}>
        <span>{p.card.description}</span>
        {p.children}
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  card: (props: Props) => ({
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    minWidth: 300,
    maxWidth: 350,
    color: '#333',
    background: titleShade(props.color ?? 'grey'),
    borderRadius: '10px',
    boxShadow: `0px 3px 10px ${props.color}aa`,
    boxSizing: 'border-box',
    overflow: 'hidden',
  }),

  titleBox: {
    display: 'flex',
    paddingTop: 10,
  },

  title: {
    fontSize: '1.5em',
    margin: '0 10px 10px 20px',
    flexGrow: 1,
  },

  inner: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '1.2em',
    backgroundColor: '#fff',
    borderRadius: '10px',
    minHeight: '100px',
    padding: '20px',
    whiteSpace: 'pre-line',
    flexGrow: 1,
    
    '& > span': {
      flexGrow: 1,
    },
  },

  type: {
    fontSize: '0.8em',
    marginRight: '10px',
    color: '#eee',
    textShadow: '0px 2px 3px #000c',
    whiteSpace: 'nowrap',
  }
});