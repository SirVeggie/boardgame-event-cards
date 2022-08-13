import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CardType } from 'shared/src/types';
import { Background } from '../components/Background';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { RootState } from '../store';
import { NotFound } from './NotFound';
import cx from 'classnames';

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
    <div className={s.container}>
      <Background bg={game.background} />
      {!cards.length && <div className={s.box}>Looks empty...</div>}

      {!currentCard && unusedCards.length && <div className={cx(s.box, s.pointer)} onClick={newCard}>
        <h1>Click to draw a card</h1>
      </div>}

      {/* {(currentCard || unusedCards.length) && <div className={s.button} onClick={newCard} />} */}

      {currentCard && <Card card={currentCard} onClick={newCard} className={s.pointer} />}

      {!currentCard && !unusedCards.length && <div className={cx(s.box, s.end)}>
        <h1>No more cards</h1>
        <Button text='Shuffle' onClick={reset} />
      </div>}
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pointer: {
    cursor: 'pointer',
    userSelect: 'none',
  },

  box: {
    backgroundColor: '#fff5',
    backdropFilter: 'blur(5px)',
    color: '#333',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    userSelect: 'none',

    '& > h1': {
      margin: 0,
    },

    '& > button': {
      marginTop: 10,
    },
  },
  
  end: {
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    
    '& > h1': {
      marginRight: 25,
    },
    
    '& > button': {
      margin: 0,
    },
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