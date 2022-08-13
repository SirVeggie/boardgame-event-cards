import { useDispatch } from 'react-redux';
import { setCards } from '../reducers/cardReducer';
import { setGames } from '../reducers/gameReducer';
import { setSessions } from '../reducers/sessionReducer';
import { getCards, getGames, getSessions } from '../tools/database';

export function useRefresh() {
  const dispatch = useDispatch();

  const refresh = async () => {
    getCards().then(cards => {
      dispatch(setCards(cards));
    }).catch(err => {
      console.log(err);
    });

    getGames().then(games => {
      dispatch(setGames(games));
    }).catch(err => {
      console.log(err);
    });
    
    getSessions().then(sessions => {
      dispatch(setSessions(sessions));
    }).catch(err => {
      console.log(err);
    });
  };

  return refresh;
}