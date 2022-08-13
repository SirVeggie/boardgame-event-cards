import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import { CardType } from 'shared';
import { Background } from '../components/Background';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Container } from '../components/Container';
import { HeaderStrip } from '../components/HeaderStrip';
import { Toggle } from '../components/Toggle';
import { useGame } from '../hooks/useGame';
import { usePlayer } from '../hooks/usePlayer';
import { useSession } from '../hooks/useSession';

export function AdvancedGame() {
  const s = useStyles();
  const [game] = useGame();
  const player = usePlayer();
  const { session, ...other } = useSession();
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  if (!game.background || !session) return <div />;

  // const debug: PublicSession = {
  //   name: 'Debug',
  //   game: game.name,
  //   host: 'Jack',
  //   deckEmpty: false,
  //   discardEmpty: false,
  //   players: ['Jack', 'Jill', 'Joe'],
  //   me: {
  //     name: 'Jack',
  //     hand: [cards[0], cards[1]],
  //   }
  // };

  // const debugLast = {
  //   player: 'Joe',
  //   card: cards[4],
  // };

  const onConfirm = (input: boolean) => {
    setModal(false);
    if (!input) return;

    other.leave();
    navigate(`/${encodeURIComponent(game?.name ?? '')}`);
  };

  return (
    <Container className={s.page}>
      <Background bg={game.background} />
      <HeaderStrip title={`${session?.name} - ${player}` ?? 'Session'}>
        <Button text='Leave' onClick={() => setModal(true)} />
      </HeaderStrip>

      <Players players={session.players} />
      <Draw />
      <RecentCard card={other.lastPlayed?.card} player={other.lastPlayed?.player} />
      <Hand cards={session.me!.hand} />

      <ConfirmationModal yesNo
        title='Leave game?'
        text='Are you sure you want to leave the game?'
        open={modal}
        onInput={onConfirm}
      />
    </Container>
  );

  function Draw() {
    const s = useStyles();

    return (
      <div className={s.draw} onClick={other.draw} />
    );
  }

  function RecentCard(p: { card?: CardType, player?: string; }) {
    const s = useStyles();

    return (
      <Toggle on={!!p.card}>
        <div className={s.recentCard}>
          <div>
            <div className={s.recentPlayer}>By {p.player ?? ''}</div>
            <Card card={p.card!} />
          </div>
        </div>
      </Toggle>
    );
  }

  function Hand(p: { cards: CardType[]; }) {
    const s = useStyles();

    return (
      <div className={s.hand}>
        <span>My cards</span>
        <div>
          {p.cards.map(card => <Card key={card.title} card={card}>
            <div className={s.card}>
              <Button text='Play' onClick={() => other.play(card)} />
              <Button text='Discard' onClick={() => other.discard(card)} />
            </div>
          </Card>)}
        </div>
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

  draw: {
    zIndex: 1,
    position: 'fixed',
    background: '#fff5',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px 0 0 10px',
    border: '1px solid #fff5',
    borderWidth: '1px 0 1px 1px',
    right: 0,
    bottom: '20%',
    height: 100,
    width: 100,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',

    '&:hover': {
      backgroundColor: '#aaa5',
    },

    '&:after': {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff4',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      fontFamily: '"Font Awesome 5 Free"',
      fontWeight: 900,
      content: '"\\e05c"',
      fontSize: 60,
    }
  },

  allcards: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
  },

  hand: {
    padding: '10px 30px 30px 30px',
    backdropFilter: 'blur(20px) contrast(90%)',
    backgroundColor: '#0002',
    border: '1px solid #6664',
    borderRadius: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    
    '& > span': {
      display: 'block',
      fontSize: 40,
      color: '#fffa',
      marginBottom: 10,
    },
    
    '& > div': {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'center',
    },
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