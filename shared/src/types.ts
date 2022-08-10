
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

export type Session = {
    name: string;
    game: string;
    host: string;
    deck: string[];
    discard: string[];
    players: Player[];
};

export type Player = {
    name: string;
    hand: string[];
};

export type NotificationType = {
    id: string;
    type: NotificationClass;
    message: string;
    hidden: boolean;
};

export type NotificationClass = 'info' | 'success' | 'error';

export type WebEvent = SessionEvent | PlayerAction;

export type SessionEvent = SessionEventCommon | SessionEventPlayer;
export type SessionEventBase = {
    type: 'session-event';
    session: string;
};

export type SessionEventCommon = SessionEventBase & {
    action: 'create' | 'delete' | 'start' | 'end';
};

export type SessionEventPlayer = SessionEventBase & {
    action: 'join' | 'leave';
    player: string;
};

export type PlayerAction = {
    type: 'player-action';
    action: 'draw' | 'discard';
};