import { GameEvent, SessionEvent, WebEvent } from 'shared';
import { useLocalSocket } from './useWebSocket';

export function useSessionComms(session: string, player: string, callback: (data: WebEvent) => void) {
    const initial: SessionEvent = {
        type: 'session-event',
        action: 'join',
        session,
        player
    };
    
    const ws = useLocalSocket(initial, data => {
        callback(data);
    });
    
    const send = (data: GameEvent) => {
        ws.send(data);
    };
    
    return { ...ws, send };
}