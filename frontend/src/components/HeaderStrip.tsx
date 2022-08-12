import React from 'react';
import { createUseStyles } from 'react-jss';
import { useGame } from '../hooks/useGame';
import { contMaxWidth, titleShade } from '../tools/cssConst';

type Props = {
  title: string;
  button?: React.ReactNode;
};

export function HeaderStrip(p: Props) {
  const [game] = useGame();
  const s = useStyles(game?.color ?? '#fff0');
  
  return (
    <div className={s.header}>
      <h1>{p.title}</h1>
      {p.button}
    </div>
  );
}

const useStyles = createUseStyles({
  header: {
    background: (color: string) => titleShade(color, '#0002'),
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '10px',
    marginBottom: 20,
    marginTop: 50,
    transition: 'margin 0.2s ease',
    backdropFilter: 'blur(3.5px)',
    
    [`@media (max-width: ${contMaxWidth})`]: {
      marginTop: 20,
    },
    
    '& > h1': {
      margin: 0,
    },
  }
});