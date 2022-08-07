import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function useCards(game: string) {
  const cards = useSelector((state: RootState) => state.cards);
  return cards.filter(card => card.game === game);
}