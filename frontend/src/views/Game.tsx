import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Background } from '../components/Background';
import { Container } from '../components/Container';
import { RootState } from '../store';
import { NotFound } from './NotFound';

export function Game() {
  const s = useStyles();
  const gameName = decodeURIComponent(useParams().game ?? '');
  const games = useSelector((state: RootState) => state.games);
  const game = games.find(x => x.name === gameName);
  const cards = useSelector((state: RootState) => state.cards)
    .filter(card => card.game === game?.name);

  if (!game)
    return <NotFound />;
  return (
    <Container className={s.container}>
      <Background bg={game.background} />
      {!cards.length && <div className={s.empty}>Looks empty...</div>}
    </Container>
  );
}

const useStyles = createUseStyles({
  container: {
    alignItems: 'center',
    height: '100vh',
  },
  
  empty: {
    padding: '1em',
    backgroundColor: '#fff',
    fontSize: '1.5em',
    borderRadius: '10px',
  },

  cards: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'red',
  }
});