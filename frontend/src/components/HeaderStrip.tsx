import React from 'react';
import { createUseStyles } from 'react-jss';
import { useGame } from '../hooks/useGame';
import { contMaxWidth, titleShade } from '../tools/cssConst';

type Props = {
  title: string;
  children?: React.ReactNode;
};

export function HeaderStrip(p: Props) {
  const [game] = useGame();
  const s = useStyles(game?.color ?? '#fff0');
  
  return (
    <header className={s.header}>
      <h1>{p.title}</h1>
      {p.children}
    </header>
  );
}

const useStyles = createUseStyles({
  header: {
    background: (color: string) => titleShade(color, '#0002'),
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    marginBottom: 20,
    marginTop: 50,
    transition: 'margin 0.2s ease',
    backdropFilter: 'blur(3.5px)',
    
    '& :first-child': {
      flexGrow: 1,
    },
    
    [`@media (max-width: ${contMaxWidth})`]: {
      marginTop: 20,
    },
    
    '& > h1': {
      margin: 0,
    },
  }
});