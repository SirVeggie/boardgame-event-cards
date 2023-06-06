import { createUseStyles } from 'react-jss';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { useState } from 'react';
import { CardType } from 'shared';
import { addCard, generateCard } from '../tools/database';
import { useNotification } from '../hooks/useNotification';
import { useRefresh } from '../hooks/useRefresh';

export function Generate() {
  const s = useStyles();
  const gameName = decodeURIComponent(useParams().game ?? '');
  const notify = useNotification();
  const refresh = useRefresh();
  const navigate = useNavigate();
  // const games = useSelector((state: RootState) => state.games);
  const [card, setCard] = useState<CardType | undefined>();

  const generate = async () => {
    const newCard = await generateCard(gameName);
    if (!newCard) {
      notify.create('error', 'Failed to generate card');
      return;
    }
    setCard(newCard);
  };

  const add = () => {
    if (!card) {
      notify.create('error', 'Card is invalid');
      return;
    }

    addCard(card);
    notify.create('success', 'Card added');
    refresh();
  };

  return (
    <Container>
      <div className={s.container}>
        <div className={s.buttons}>
          <Button text='Back' onClick={() => navigate('/')} />
          <Button text='Generate' onClick={generate} />
          <Button text='Add current' onClick={add} />
        </div>
        <div className={s.container2}>
          {card && <Card card={card} />}
        </div>
      </div>
    </Container>
  );
}

const useStyles = createUseStyles({
  container: {
    paddingTop: 50,
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },

  buttons: {
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      marginRight: 10,
    }
  },

  container2: {
    marginTop: 20,
    flexGrow: 1,
    // backgroundColor: 'blue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  }
});