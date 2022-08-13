import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CardType, ErrorEvent, ERROR_EVENT, GameEvent, PLAYER_EVENT, PublicSession, SESSION_EVENT, SyncEvent, SYNC_EVENT } from 'shared';
import { useNotification } from './useNotification';
import { usePlayer } from './usePlayer';
import { useSessionComms } from './useSessionComms';

export function useSession() {
  const sessionName = decodeURIComponent(useParams().session ?? '');
  const player = usePlayer();
  const [session, setSession] = useState<PublicSession | undefined>();
  const notify = useNotification();
  const [lastPlayed, setLastPlayed] = useState<{ player: string, card: CardType | undefined; } | undefined>();
  
  const [sendEvent, connected] = useSessionComms(sessionName, player, event => {
    if (event.type === ERROR_EVENT)
      return handleError(event);
    if (event.type === SYNC_EVENT) {
      handleSync(event);
      return;
    }

    const card = handleEvent(event);
    if (card)
      setLastPlayed({ player: event.player, card });
  });

  // useEffect(() => {
  //   if (connected) {
  //     notify.create('success', 'Connected');
  //   } else if (!connected) {
  //     notify.create('error', 'Disconnected from server');
  //   }
  // }, [connected]);

  const leave = () => {
    notify.create('info', 'Leaving session');
    sendEvent({ type: SESSION_EVENT, action: 'leave', session: sessionName, player });
  };

  const draw = () => {
    sendEvent({ type: PLAYER_EVENT, action: 'draw', player, session: sessionName });
  };

  const discard = (card: CardType) => {
    sendEvent({ type: PLAYER_EVENT, action: 'discard', player, session: sessionName, card });
  };

  const play = (card: CardType) => {
    sendEvent({ type: PLAYER_EVENT, action: 'play', player, session: sessionName, card });
  };

  return { session, lastPlayed, leave, draw, discard, play } as {
    session: PublicSession | undefined;
    lastPlayed: typeof lastPlayed;
    leave: () => void;
    draw: () => void;
    discard: (card: CardType) => void;
    play: (card: CardType) => void;
  };



  function handleError(event: ErrorEvent) {
    notify.create('error', event.message);
  }

  function handleSync(event: SyncEvent) {
    setSession(event.session);
  }

  function handleEvent(event: GameEvent) {
    if (event.action === 'join') {
      notify.create('info', `${event.player} joined`);

    } else if (event.action === 'leave') {
      notify.create('info', `${event.player} left`);

    } else if (event.action === 'draw') {
      notify.create('info', `${event.player} drew a card`);

    } else if (event.action === 'discard') {
      notify.create('info', `${event.player} discarded a card`);
      
    } else if (event.action === 'play') {
      notify.create('info', `${event.player} played ${event.card!.title}`);
      return event.card;
    }
  }
}
