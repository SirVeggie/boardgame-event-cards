import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotificationEmitter } from './components/NotificationEmitter';
import { useRefresh } from './hooks/useRefresh';
import { AddCard } from './views/AddCard';
import { AddGame } from './views/AddGame';
import { AdvancedGame } from './views/AdvancedGame';
import { BrowseCards } from './views/BrowseCards';
import { Game } from './views/Game';
import { Games } from './views/Games';
import { NotFound } from './views/NotFound';
import { Sessions } from './views/Sessions';
import { Generate } from './views/Generate';

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
        <Route path='/:game' element={<Sessions />} />
        <Route path='/:game/basic' element={<Game />} />
        <Route path='/:game/:session/:player' element={<AdvancedGame />} />
        <Route path='/:game/new' element={<AddCard />} />
        <Route path='/:game/cards' element={<BrowseCards />} />
        <Route path='/:game/generate' element={<Generate />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}
