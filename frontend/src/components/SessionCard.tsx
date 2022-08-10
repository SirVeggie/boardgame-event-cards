import { createUseStyles } from 'react-jss';
import { Session } from 'shared';

type Props = {
  session: Session,
};

export function SessionCard(p: Props) {
  return (
    <div>
      <h1>SessionCard</h1>
    </div>
  );
}

const useStyles = createUseStyles({
  card: {
    
  },
});