
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

export type NotificationType = {
    id: string;
    type: NotificationClass;
    message: string;
    hidden: boolean;
};

export type NotificationClass = 'info' | 'success' | 'error';