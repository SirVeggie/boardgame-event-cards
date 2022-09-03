import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LobbyEvent, PublicSession } from 'shared';
import { Background } from '../components/Background';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { HeaderStrip } from '../components/HeaderStrip';
import { SessionCard } from '../components/SessionCard';
import { useForm } from '../hooks/useForm';
import { useGame } from '../hooks/useGame';
import { useNotification } from '../hooks/useNotification';
import { useLocalSocket } from '../hooks/useWebSocket';
import { addSession } from '../reducers/sessionReducer';
import { createSession } from '../tools/database';

export function Sessions() {
  const s = useStyles();
  const dispatch = useDispatch();
  const [game] = useGame();
  const [sessions, setSessions] = useState([] as PublicSession[]);
  const navigate = useNavigate();
  const notify = useNotification();
  useLocalSocket({ type: 'lobby-event', action: 'subscribe' }, (event: LobbyEvent) => {
    if (!event || event?.type !== 'lobby-event' || event.action !== 'sync')
      return;
    setSessions(event.sessions!.filter(x => x.game === game.name));
  });

  const form = useForm('Create Session', {
    name: { label: 'Session name', type: 'text' },
    host: { label: 'Player name', type: 'text' },
  }, data => {
    createSession({ ...data, game: game.name }).then(async res => {
      dispatch(addSession(res));
      navigate(`/${encodeURIComponent(game.name)}/${encodeURIComponent(data.name)}/${encodeURIComponent(data.host)}`);
    }).catch(err => {
      notify.create('error', err.error);
    });
  });

  return (
    <Container className={s.container}>
      {form.component}
      <Background bg={game.background} />
      <HeaderStrip title='Sessions'>
        <Button text='Basic' onClick={() => navigate(`/${encodeURIComponent(game.name)}/basic`)} />
        <Button text='Create' onClick={() => form.setOpen(true)} />
        <Button text='Back' onClick={() => navigate('/')} />
      </HeaderStrip>

      <div className={s.sessions}>
        {sessions.map(session => <SessionCard key={session.name} session={session} color={game.color} />)}
      </div>
    </Container>
  );
}

const useStyles = createUseStyles({
  container: {
    '& header button': {
      marginLeft: 10,
    }
  },
  
  sessions: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  }
});