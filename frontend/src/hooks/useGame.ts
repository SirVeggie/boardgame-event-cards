import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CardType, GameInfo } from 'shared';
import { RootState } from '../store';

export function useGame() {
  const gameName = decodeURIComponent(useParams().game ?? '');
  const game = useSelector((state: RootState) => state.games.find(x => x.name === gameName));
  const cards = useSelector((state: RootState) => state.cards.filter(card => card.game === game?.name));
  return [{ ...game, name: gameName }, cards] as [GameInfo, CardType[]];
}