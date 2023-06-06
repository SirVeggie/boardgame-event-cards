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
import { useForm } from '../hooks/useForm';
import { useGame } from '../hooks/useGame';
import { useInput } from '../hooks/useInput';

export function Generate() {
  const s = useStyles();
  const gameName = decodeURIComponent(useParams().game ?? '');
  const notify = useNotification();
  const refresh = useRefresh();
  const navigate = useNavigate();
  const [game] = useGame(gameName);
  const [card, setCard] = useState<CardType | undefined>();
  const [condField, condText] = useInput('AI instruction', 'textarea', 'Please generate a new event card using these examples as a guide:');

  const form = useForm('Edit card', {
    title: { label: 'Title', type: 'text' },
    description: { label: 'Description', type: 'textarea' },
    type: { label: 'Category', type: 'select', options: game?.types ?? [] },
  }, data => {
    addCard({ ...data, game: gameName }).then(() => {
      notify.create('success', 'Card updated successfully');
      refresh();
    }).catch(err => {
      notify.create('error', err.error);
    });
  });

  const generate = async () => {
    const newCard = await generateCard(gameName, condText);
    if (!newCard) {
      notify.create('error', 'Failed to generate card');
      return;
    }
    setCard(newCard);
  };

  const add = () => {
    form.setOpen(true, card);
    // if (!card) {
    //   notify.create('error', 'Card is invalid');
    //   return;
    // }

    // addCard(card);
    // notify.create('success', 'Card added');
    // refresh();
  };

  return (
    <Container>
      <div className={s.container}>
        {form.component}
        <div className={s.buttons}>
          <Button text='Back' onClick={() => navigate('/')} />
          <Button text='Generate' onClick={generate} />
          <Button text='Add current' onClick={add} />
        </div>
        <div className={s.container2}>
          <div>
            <div className={s.instruction}>
              {condField}
            </div>
            {card && <Card card={card} />}
          </div>
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
  },
  
  instruction: {
    padding: '10px 10px 5px 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    display: 'flex',
    borderRadius: 10,
    marginBottom: 10,
    
    '& > div': {
      width: '100%',
      '& > label': {
        fontSize: 20,
        color: '#282828',
        fontWeight: 'bold',
      },
      '& > textarea': {
        minWidth: '100%',
        minHeight: 50,
      }
    }
  }
});