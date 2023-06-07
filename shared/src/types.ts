
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

export type SimpleSession = Omit<Session, 'deck' | 'discard' | 'players' | 'playHistory'>;
export type Session = {
    name: string;
    game: string;
    host: string;
    deck: CardType[];
    discard: CardType[];
    playHistory: { player: string, card: CardType; }[];
    players: Player[];
};

export type PublicSession = {
    name: string;
    game: string;
    host: string;
    deckEmpty: boolean;
    discardEmpty: boolean;
    playHistory: { player: string, card: CardType; }[];
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

export type WebEvent = GameEvent | ErrorEvent | SyncEvent | LobbyEvent;

export type GameEvent = SessionEvent | PlayerEvent;
type GameEventBase = {
    player: string;
    session: string;
};

export const LOBBY_EVENT = 'lobby-event';
export type LobbyEvent = {
    type: typeof LOBBY_EVENT;
    action: 'subscribe' | 'unsubscribe' | 'sync';
    sessions?: PublicSession[];
};

export const SYNC_EVENT = 'sync-event';
export type SyncEvent = {
    type: typeof SYNC_EVENT;
    session: PublicSession;
};

export const SESSION_EVENT = 'session-event';
export type SessionEvent = GameEventBase & {
    type: typeof SESSION_EVENT;
    action: 'create' | 'delete' | 'start' | 'end' | 'join' | 'leave';
};

export const PLAYER_EVENT = 'player-event';
export type PlayerEvent = GameEventBase & {
    type: typeof PLAYER_EVENT;
    action: 'draw' | 'discard' | 'play' | 'give';
    card?: CardType;
    target?: string;
};

export const ERROR_EVENT = 'error-event';
export type ErrorEvent = {
    type: typeof ERROR_EVENT;
    message: string;
};