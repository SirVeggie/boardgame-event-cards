import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotificationEmitter } from './components/NotificationEmitter';
import { useRefresh } from './hooks/useRefresh';
import { AddCard } from './views/AddCard';
import { AddGame } from './views/AddGame';
import { BrowseCards } from './views/BrowseCards';
import { Game } from './views/Game';
import { Games } from './views/Games';
import { NotFound } from './views/NotFound';

export function App() {
  const refresh = useRefresh();
  
  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className='app'>
      <NotificationEmitter />
      <Routes>
        <Route path='/' element={<Games />} />
        <Route path='/new' element={<AddGame />} />
        <Route path='/:game' element={<Game />} />
        <Route path='/:game/new' element={<AddCard />} />
        <Route path='/:game/cards' element={<BrowseCards />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}
