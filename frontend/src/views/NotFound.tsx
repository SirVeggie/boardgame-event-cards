import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Container } from '../components/Container';

export function NotFound() {
  const s = useStyles();
  const navigate = useNavigate();
  
  const home = () => {
    navigate('/');
  };
  
  return (
    <Container className={s.container}>
      <div className={s.box}>
        <h1>404</h1>
        <p>Page not found</p>
        <Button text='Return home' onClick={home} />
      </div>
    </Container>
  );
}

const useStyles = createUseStyles({
  container: {
    paddingTop: 50,
  },
  
  box: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    
    '& h1': {
      marginTop: 0
    }
  }
});