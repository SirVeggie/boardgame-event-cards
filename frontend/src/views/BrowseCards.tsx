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
import { useGame } from '../hooks/useGame';
import { useNotification } from '../hooks/useNotification';
import { useRefresh } from '../hooks/useRefresh';
import { removeCard } from '../tools/database';
import { NotFound } from './NotFound';

export function BrowseCards() {
  const s = useStyles();
  const notify = useNotification();
  const refresh = useRefresh();
  const navigate = useNavigate();
  const [game, cards] = useGame();
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState('');

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
      <ConfirmationModal warning yesNo
        title='Delete card?'
        open={modal}
        onInput={onConfirm}
      >
        {dataCard && <Card card={dataCard} />}
      </ConfirmationModal>
      <Background bg={game.background} />

      <HeaderStrip
        title={game.name}
        button={<Button text='Back' onClick={() => navigate('/')} />}
      />
      
      {!cards.length && <div className={s.empty}>Looks empty...</div>}
      <div className={s.cards}>
        {cards.map(card => <Card key={card.title} card={card}>
          <div className={s.spacer}>
            <div />
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
    
    // '& > *': {
      // flex: '1 1 300px',
    // },
  },

  spacer: {
    display: 'flex',
    flexDirection: 'row',

    '& > div': {
      flexGrow: 1,
    }
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