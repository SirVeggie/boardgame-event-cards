import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CardType } from 'shared/src/types';
import { Background } from '../components/Background';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
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

  const [usedCards, setUsedCards] = useState([] as CardType[]);
  const [unusedCards, setUnusedCards] = useState(cards);
  const [currentCard, setCurrentCard] = useState<CardType | undefined>(undefined);

  useEffect(() => {
    reset();
  }, [cards.length]);

  const newCard = () => {
    const random = Math.floor(Math.random() * unusedCards.length);
    setCurrentCard(unusedCards[random]);
    setUsedCards([...usedCards, unusedCards[random]]);
    setUnusedCards(unusedCards.filter((_, i) => i !== random));
  };
  
  const reset = () => {
    setCurrentCard(undefined);
    setUsedCards([]);
    setUnusedCards(cards);
  };

  if (!game)
    return <NotFound />;
  return (
    <Container className={s.container}>
      <Background bg={game.background} />
      {!cards.length && <div className={s.empty}>Looks empty...</div>}
      {(currentCard || unusedCards.length) && <div className={s.button} onClick={newCard} />}
      {currentCard && <Card card={currentCard} />}
      {!currentCard && unusedCards.length && <div className={s.box}>
        <h1>Click to draw a card</h1>
      </div>}
      {!currentCard && !unusedCards.length && <div className={s.box}>
        <h1>No more cards</h1>
        <Button text='Shuffle' onClick={reset} />
      </div>}
    </Container>
  );
}

const useStyles = createUseStyles({
  container: {
    alignItems: 'center',
    height: '100vh',
  },

  box: {
    backgroundColor: '#fff5',
    backdropFilter: 'blur(5px)',
    color: '#333',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',

    '& > h1': {
      margin: 0,
    },
    
    '& > button': {
      marginTop: 10,
    }
  },

  button: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    cursor: 'pointer',
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