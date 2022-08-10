import { createUseStyles } from 'react-jss';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { HeaderStrip } from '../components/HeaderStrip';

export function Sessions() {
  const s = useStyles();
  const game = decodeURIComponent(useParams().game ?? '');
  const navigate = useNavigate();

  return (
    <Container className={s.container}>
      <HeaderStrip
        title='Sessions'
        button={<Button text='Back' onClick={() => navigate('/')} />}
      />

    </Container>
  );
}

const useStyles = createUseStyles({
  container: {
    paddingTop: 50,

    '& > button': {
      marginBottom: 10,
    }
  }
});