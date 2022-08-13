import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import { PublicSession } from 'shared';
import { useForm } from '../hooks/useForm';
import { titleShade } from '../tools/cssConst';
import cx from 'classnames';

type Props = {
  session: PublicSession;
  color?: string;
};

export function SessionCard(p: Props) {
  const s = useStyles(p.color);
  const navigate = useNavigate();

  const form = useForm('Join Session', {
    name: { label: 'Your name', type: 'text' },
  }, data => {
    navigate(`/${encodeURIComponent(p.session.game)}/${encodeURIComponent(p.session.name)}/${encodeURIComponent(data.name)}`);
  });

  const click = () => {
    form.setOpen(true);
  };

  return (
    <div className={cx(s.container, s.values)}>
      {form.component}
      <div className={s.back}>
        <div className={s.card} onClick={click}>
          <div className={s.titleBox}>
            <h2>{p.session.name}</h2>
          </div>

          <div className={s.inner}>
            Players:<br />
            {p.session.players.map(name => <div key={name}>{name}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  values: (color: string) => ({
    '--shade': titleShade(color ?? 'grey'),
  }),
  
  container: {
    flex: '1 1 200px',
    minWidth: 200,
    maxWidth: 300,
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.5)',
    boxSizing: 'border-box',
  },
  
  back: {
    backdropFilter: 'blur(7.5px) contrast(50%)',
  },

  card: {
    userSelect: 'none',
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    color: '#111',
    background: 'var(--shade)',
    opacity: 0.75,
    cursor: 'pointer',
  },

  titleBox: {
    display: 'flex',
    paddingTop: 10,

    '& > h2': {
      fontSize: '1.5em',
      margin: '0 10px 10px 20px',
      flexGrow: 1,
    },
  },

  inner: {
    color: '#000',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '1.2em',
    backgroundColor: '#fff',
    minHeight: '100px',
    padding: '20px',
    whiteSpace: 'pre-line',
    flexGrow: 1,
  },

  type: {
    fontSize: '0.8em',
    marginRight: '10px',
    color: '#eee',
    textShadow: '0px 2px 3px #000c',
    whiteSpace: 'nowrap',
  }
});