import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import { CardType } from 'shared/src/types';
import { Background } from '../components/Background';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Container } from '../components/Container';
import { HeaderStrip } from '../components/HeaderStrip';
import { useForm } from '../hooks/useForm';
import { useGame } from '../hooks/useGame';
import { useNotification } from '../hooks/useNotification';
import { useRefresh } from '../hooks/useRefresh';
import { removeCard, updateCard } from '../tools/database';
import { NotFound } from './NotFound';

export function BrowseCards() {
  const s = useStyles();
  const notify = useNotification();
  const refresh = useRefresh();
  const navigate = useNavigate();
  const [game, cards] = useGame();
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState('');

  const form = useForm('Edit card', {
    title: { label: 'Title', type: 'text' },
    description: { label: 'Description',type: 'textarea' },
    type: { label: 'Category', type: 'select', options: game?.types ?? [] },
  }, data => {
    updateCard({ ...data, game: game?.name ?? '' }).then(() => {
      notify.create('success', 'Card updated successfully');
      refresh();
    }).catch(err => {
      notify.create('error', err.error);
    });
  });

  const startEdit = (card: CardType) => {
    return () => {
      form.setOpen(true, card);
    };
  };

  const onDelete = (card: CardType) => {
    return () => {
      setModalData(card.title);
      setModal(true);
    };
  };

  const onConfirm = (input: boolean) => {
    setModal(false);
    if (!input) return;

    removeCard(modalData).then(() => {
      notify.create('success', 'Card was removed');
      refresh();
    }).catch(err => {
      notify.create('error', err.error);
    });
  };

  const dataCard = cards.find(x => x.title === modalData);

  if (!game)
    return <NotFound />;
  return (
    <Container className={s.container}>
      {form.component}
      <ConfirmationModal warning yesNo
        title='Delete card?'
        open={modal}
        onInput={onConfirm}
      >
        {dataCard && <Card card={dataCard} />}
      </ConfirmationModal>
      <Background bg={game.background} />

      <HeaderStrip title={`${game.name} Deck`}>
        <Button text='Back' onClick={() => navigate('/')} />
      </HeaderStrip>

      {!cards.length && <div className={s.empty}>Looks empty...</div>}
      <div className={s.cards}>
        {cards.map(card => <Card key={card.title} card={card}>
          <div className={s.spacer}>
            <Button text='Edit' onClick={startEdit(card)} />
            <Button text='Delete' onClick={onDelete(card)} className={s.delete} />
          </div>
        </Card>)}
      </div>
    </Container>
  );
}

const useStyles = createUseStyles({
  container: {
    paddingBottom: 50,
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
    gap: '10px',
    justifyContent: 'center',
  },

  spacer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  delete: {
    color: '#fff',
    backgroundColor: '#c94747',
    boxShadow: '0px 1px 1px #522a',
    borderColor: '#d33',
    position: 'relative',
    right: 0,
  },
});