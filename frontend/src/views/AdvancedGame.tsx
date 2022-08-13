import { createUseStyles } from 'react-jss';
import { useGame } from '../hooks/useGame';
import { useMobile } from '../hooks/useMobile';
import { usePlayer } from '../hooks/usePlayer';
import { useSession } from '../hooks/useSession';

export function AdvancedGame() {
  const game = useGame();
  const player = usePlayer();
  const session = useSession(player);
  const mobile = useMobile();
  
  return (
    <div>
      
    </div>
  );
}

const useStyles = createUseStyles({
  
});