
export type GameInfo = {
    name: string;
    types: string[];
    color: string;
    background: string;
};

export type CardType = {
    game: string;
    type: string;
    title: string;
    description: string;
};

export type SimpleSession = Omit<Session, 'deck' | 'discard' | 'players'>;
export type Session = {
    name: string;
    game: string;
    host: string;
    deck: CardType[];
    discard: CardType[];
    players: Player[];
};

export type PublicSession = {
    name: string;
    game: string;
    host: string;
    deckEmpty: boolean;
    discardEmpty: boolean;
    players: string[];
    me?: Player;
};

export type Player = {
    name: string;
    hand: CardType[];
};

export type NotificationType = {
    id: string;
    type: NotificationClass;
    message: string;
    hidden: boolean;
};

export type NotificationClass = 'info' | 'success' | 'error';

export type WebEvent = GameEvent | ErrorEvent | SyncEvent;

export type GameEvent = SessionEvent | PlayerEvent;
type GameEventBase = {
    player: string;
    session: string;
};

export const SYNC_EVENT = 'sync-event';
export type SyncEvent = {
    type: typeof SYNC_EVENT;
    session: PublicSession;
}

export const SESSION_EVENT = 'session-event';
export type SessionEvent = GameEventBase & {
    type: typeof SESSION_EVENT;
    action: 'create' | 'delete' | 'start' | 'end' | 'join' | 'leave';
};

export const PLAYER_EVENT = 'player-event';
export type PlayerEvent = GameEventBase & {
    type: typeof PLAYER_EVENT;
    action: 'draw' | 'discard' | 'play';
    card?: CardType;
};

export const ERROR_EVENT = 'error-event';
export type ErrorEvent = {
    type: typeof ERROR_EVENT;
    message: string;
};

export function wsError(message: string): ErrorEvent {
    return {
        type: ERROR_EVENT,
        message
    };
}