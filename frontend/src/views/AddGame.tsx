import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import { Background } from '../components/Background';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { FormBase } from '../components/FormBase';
import { HeaderStrip } from '../components/HeaderStrip';
import { Tag } from '../components/Tag';
import { useInput } from '../hooks/useInput';
import { useNotification } from '../hooks/useNotification';
import { useRefresh } from '../hooks/useRefresh';
import { addGame } from '../tools/database';

export function AddGame() {
  const s = useStyles();
  const navigate = useNavigate();
  const refresh = useRefresh();
  const [nameField, name] = useInput('Name');
  const [colorField, color] = useInput('Color', 'color');
  const [backgroundField, background] = useInput('Background');
  const [typesField, typeString] = useInput('Types');
  const notify = useNotification();

  const types = typeString.split(/, */).map(t => t.trim()).filter(t => t);

  const submit = (e: any) => {
    e.preventDefault();
    addGame({ name, color, background, types }).then(() => {
      notify.create('success', 'Card added successfully');
      refresh();
      navigate('/');
    }).catch(err => {
      notify.create('error', err.error);
    });
  };

  return (
    <Container className={s.container}>
      <Background bg={background} />

      <HeaderStrip
        title='Sessions'
        button={<Button text='Back' onClick={() => navigate('/')} />}
      />

      <div className={s.layout}>
        <FormBase onSubmit={submit} glass>
          {nameField}
          {colorField}
          {backgroundField}
          {typesField}
          <div className={s.tags}>
            {types.map((t, i) => <Tag key={i} text={t} style={{ marginRight: 5 }} />)}
          </div>
          <Button text='Create' />
        </FormBase>

        <div>
          <Card card={{
            title: 'Legendary Spell',
            description: 'This is a card',
            type: types[0] ?? 'Test',
            game: name
          }} color={color} style={{ float: 'right' }} />
        </div>
      </div>
    </Container>
  );
}

const useStyles = createUseStyles({
  container: {
    paddingBottom: 20,
  },

  layout: {
    display: 'flex',
    flexWrap: 'wrap',

    '& > :first-child': {
      marginRight: '20px',
      marginBottom: '20px'
    },
  },

  tags: {
    display: 'flex',
    flexWrap: 'wrap',

    '& > *': {
      marginBottom: '5px'
    },
  },
});