import { v1 } from 'uuid';
import { CardType, GameInfo, Session } from './types';

export class UserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export function userError(message: string): UserError {
    return new UserError(message);
}

export const cardPath = '/api/cards';
export const gamePath = '/api/games';
export const sessionPath = '/api/sessions';

export function validateCard(card: CardType): CardType {
    const newCard = {
        title: card.title.trim(),
        description: card.description.trim(),
        game: card.game.trim(),
        type: card.type.trim()
    };

    if (!newCard.title)
        throw userError('Title cannot be empty');
    if (!newCard.description)
        throw userError('Description cannot be empty');
    if (!newCard.game)
        throw userError('Game cannot be empty');
    if (!newCard.type)
        throw userError('Type cannot be empty');

    return newCard;
}

export function validateGame(game: GameInfo): GameInfo {
    const newGame = {
        name: game.name.trim(),
        types: game.types.map(x => x.trim()),
        color: game.color.trim(),
        background: game.background.trim()
    };

    if (!newGame.name)
        throw userError('Name cannot be empty');
    if (!newGame.types.length)
        throw userError('Needs at least one type');
    if (newGame.types.some(x => !x))
        throw userError('Types cannot be empty');
    if (!newGame.color)
        throw userError('Color cannot be empty');
    if (!newGame.background)
        throw userError('Background cannot be empty');

    return newGame;
}

export function validateSession(session: Session): Session {
    const newSession = {
        game: session.game?.trim(),
        deck: session.deck?.map(x => x.trim()),
        discard: session.discard?.map(x => x.trim()),
        players: session.players?.map(x => ({
            name: x.name?.trim(),
            hand: x.hand?.map(y => y.trim())
        }))
    };

    if (!newSession.game)
        throw userError('Game cannot be empty');
    if (!newSession.deck)
        throw userError('Deck cannot be null');
    if (!newSession.discard)
        throw userError('Discard cannot be null');
    if (!newSession.players)
        throw userError('Players cannot be null');
    if (newSession.players.some(x => !x.hand))
        throw userError('Hand cannot be null');
    if (newSession.deck.some(x => !x))
        throw userError('Deck cards cannot contain empty cards');
    if (newSession.discard.some(x => !x))
        throw userError('Discard cards cannot contain empty cards');
    if (!newSession.players.length)
        throw userError('Needs at least one player');
    if (newSession.players.some(x => !x.name))
        throw userError('Names cannot be empty');
    if (newSession.players.some(x => x.hand.some(y => !y)))
        throw userError('Hand cards cannot contain empty cards');

    return newSession;
}

export function overwriteSession(session: Partial<Session>, current: Session): Session {
    const newSession = {
        game: session.game ?? current.game,
        deck: session.deck ?? current.deck,
        discard: session.discard ?? current.discard,
        players: session.players ? current.players.map(x => {
            return session.players!.find(y => y.name === x.name) ?? x;
        }) : current.players
    };

    return newSession;
}

export function uuid(): string {
    return v1();
}