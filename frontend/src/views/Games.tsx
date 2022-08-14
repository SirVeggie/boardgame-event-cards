import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { GameCard } from '../components/GameCard';
import { Toggle } from '../components/Toggle';
import { RootState } from '../store';

export function Games() {
  const s = useStyles();
  const navigate = useNavigate();
  const games = useSelector((state: RootState) => state.games);

  return (
    <Container className={s.container}>
      <Toggle on={!games.length}>
        <div className={s.empty}>Looks empty...</div>
      </Toggle>

      <Toggle on={!!games.length}>
        <div className={s.games}>
          {games.map(x => <GameCard key={x.name} game={x} />)}
        </div>
      </Toggle>

      <Button text='Add Game' onClick={() => navigate('/new')} />
    </Container>
  );
}

const useStyles = createUseStyles({
  container: {
    paddingTop: 50,
  },

  empty: {
    padding: '1em',
    backgroundColor: '#fff',
    fontSize: '1.5em',
    borderRadius: '10px',
    marginBottom: 20,
  },

  games: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: 20,
  }
});