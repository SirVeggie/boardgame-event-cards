import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Background } from '../components/Background';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { FormBase } from '../components/FormBase';
import { useInput } from '../hooks/useInput';
import { useNotification } from '../hooks/useNotification';
import { useRefresh } from '../hooks/useRefresh';
import { useSelect } from '../hooks/useSelect';
import { RootState } from '../store';
import { addCard } from '../tools/database';
import { NotFound } from './NotFound';

export function AddCard() {
  const s = useStyles();
  const navigate = useNavigate();
  const refresh = useRefresh();
  const gameName = useParams().game;
  const game = useSelector((state: RootState) => state.games).find(g => g.name === gameName);

  const [titleField, title] = useInput('Title');
  const [descriptionField, description] = useInput('Description', 'textarea');
  const [typeField, type] = useSelect('Type', game?.types ?? ['(Empty)']);
  const notify = useNotification();

  if (!game)
    return <NotFound />;

  const submit = (e: any) => {
    e.preventDefault();
    addCard({ title, description, type, game: game?.name }).then(() => {
      notify.create('success', 'Card added successfully');
      titleField.reset();
      descriptionField.reset();
      typeField.reset();
    }).catch(err => {
      notify.create('error', err.error);
    });
  };
  
  const back = () => {
    refresh();
    navigate('/');
  };

  return (
    <Container className={s.container}>
      <Background bg={game.background} />
      <div className={s.layout}>
        <FormBase onSubmit={submit}>
          {titleField}
          {descriptionField}
          {typeField}
          <Button className={s.button} text='Create' />
        </FormBase>

        <div style={{ marginBottom: 20 }}>
          <Card card={{ title, description, type, game: game.name }} />
        </div>
      </div>
      <Button text='Back' onClick={back} />
    </Container>
  );
}

const useStyles = createUseStyles({
  container: {
    alignItems: 'center',
    height: '100vh',
  },
  
  layout: {
    display: 'flex',
    flexWrap: 'wrap',
    
    '& > :first-child': {
      marginRight: '20px',
      marginBottom: '20px'
    }
  },

  button: {
    maxWidth: '100px',
  }
});