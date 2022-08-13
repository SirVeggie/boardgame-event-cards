import { GameEvent, SessionEvent, WebEvent } from 'shared';
import { useLocalSocket } from './useWebSocket';

export function useSessionComms(session: string, player: string, callback: (data: WebEvent) => void) {
    const initial: SessionEvent = {
        type: 'session-event',
        action: 'join',
        session,
        player
    };
    
    const [sendData, connected] = useLocalSocket(initial, data => {
        callback(data);
    });
    
    const send = (data: GameEvent) => {
        sendData(data);
    };
    
    return [send, connected] as [typeof send, typeof connected];
}