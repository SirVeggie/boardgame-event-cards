import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import { CardType, PublicSession } from 'shared';
import { Background } from '../components/Background';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Container } from '../components/Container';
import { HeaderStrip } from '../components/HeaderStrip';
import { useGame } from '../hooks/useGame';
import { useMobile } from '../hooks/useMobile';
import { useNotification } from '../hooks/useNotification';
import { usePlayer } from '../hooks/usePlayer';
import { useSession } from '../hooks/useSession';
import { NotFound } from './NotFound';

export function AdvancedGame() {
  const s = useStyles();
  const [game, cards] = useGame();
  const player = usePlayer();
  const { session, ...other } = useSession();
  const mobile = useMobile();
  const [modal, setModal] = useState(false);
  const notify = useNotification();
  const navigate = useNavigate();

  if (!game.background) return <NotFound />;

  const debug: PublicSession = {
    name: 'Debug',
    game: game.name,
    host: 'Jack',
    deckEmpty: false,
    discardEmpty: false,
    players: ['Jack', 'Jill', 'Joe'],
    me: {
      name: 'Jack',
      hand: [cards[0], cards[1]],
    }
  };

  const debugLast = {
    player: 'Joe',
    card: cards[4],
  };

  const onConfirm = (input: boolean) => {
    setModal(false);
    if (!input) return;

    other.leave();
    navigate(`/${encodeURIComponent(game?.name ?? '')}`);
  };

  return (
    <Container className={s.page}>
      <Background bg={game.background} />
      <HeaderStrip title={session?.name ?? 'Session'}>
        <Button text='Leave' onClick={() => setModal(true)} />
      </HeaderStrip>

      <Players players={debug.players} />

      <RecentCard card={debugLast.card} player={debugLast.player} />

      <div className={s.hand}>
        <Hand cards={debug.me!.hand} />
      </div>

      <ConfirmationModal yesNo
        title='Leave game?'
        text='Are you sure you want to leave the game?'
        open={modal}
        onInput={onConfirm}
      />
    </Container>
  );

  function RecentCard(p: { card: CardType, player: string; }) {
    const s = useStyles();

    return (
      <div className={s.recentCard}>
        <div>
          <div className={s.recentPlayer}>By {p.player}</div>
          <Card card={p.card} />
        </div>
      </div>
    );
  }

  function Hand(p: { cards: CardType[]; }) {
    const s = useStyles();

    return (
      <div className={s.hand}>
        {p.cards.map(card => <Card key={card.title} card={card}>
          <div className={s.card}>
            <Button text='Play' onClick={() => other.play(card)} />
            <Button text='Discard' onClick={() => other.discard(card)} />
          </div>
        </Card>)}
      </div>
    );
  }

  function Players(p: { players: string[]; }) {
    const s = useStyles();

    return (
      <div className={s.players}>
        {p.players.map(player => <div className={s.player} key={player}>{player}</div>)}
      </div>
    );
  }
}

const useStyles = createUseStyles({
  page: {
    position: 'relative',
    padding: '0 20px',
  },

  allcards: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
  },

  hand: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: 20,
  },

  card: {
    display: 'flex',
    justifyContent: 'space-between',

    '& > button': {

    },
  },

  recentCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    // backdropFilter: 'blur(15px) brightness(0.7)',
    // boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    // borderRadius: 40,
    padding: 30,
  },

  recentPlayer: {
    borderRadius: '10px 10px 0 0',
    textAlign: 'center',
    display: 'inline-block',
    backgroundColor: '#fff1',
    backdropFilter: 'blur(10px) contrast(50%)',
    fontSize: '1em',
    padding: '5px 10px',
    position: 'relative',
    left: 10,
    minWidth: 100
  },

  players: {
    position: 'relative',

    '& :first-child': {
      borderBottomLeftRadius: '10px',
    },

    '& :last-child': {
      borderBottomRightRadius: '10px',
    },
  },

  player: {
    textAlign: 'center',
    color: '#fffa',
    display: 'inline-block',
    backgroundColor: '#0005',
    backdropFilter: 'blur(10px) contrast(50%)',
    fontSize: '1.5em',
    padding: '5px 10px',
    position: 'relative',
    top: -20,
    left: 20,
    minWidth: 50
  },
});