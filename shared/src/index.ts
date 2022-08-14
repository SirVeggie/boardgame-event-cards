export * from './types';
import { v1 } from 'uuid';
import { CardType, GameInfo, Session, SimpleSession } from './types';


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
        throw userError('Card title cannot be empty');
    if (!newCard.description)
        throw userError('Card description cannot be empty');
    if (!newCard.game)
        throw userError('Card game cannot be empty');
    if (!newCard.type)
        throw userError('Card type cannot be empty');

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
        throw userError('Game name cannot be empty');
    if (!newGame.types.length)
        throw userError('Game needs at least one type');
    if (newGame.types.some(x => !x))
        throw userError('Game types cannot be empty');
    if (!newGame.color)
        throw userError('Game color cannot be empty');
    if (!newGame.background)
        throw userError('Game background cannot be empty');

    return newGame;
}

export function validateSession(session: Session): Session {
    const newSession = {
        name: session.name?.trim(),
        game: session.game?.trim(),
        host: session.host?.trim(),
        deck: session.deck,
        discard: session.discard,
        playHistory: session.playHistory.map(x => ({
            player: x.player.trim(),
            card: x.card
        })),
        players: session.players?.map(x => ({
            name: x.name?.trim(),
            hand: x.hand
        }))
    };

    if (!newSession.name)
        throw userError('Name cannot be empty');
    if (!newSession.game)
        throw userError('Game cannot be empty');
    if (!newSession.host)
        throw userError('Host cannot be empty');
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
    if (newSession.playHistory.some(x => !x))
        throw userError('Play history cannot contain undefined cards');
    if (newSession.playHistory.some(x => !x.player))
        throw userError('Play history cannot contain empty players');

    newSession.players.some(x => x.hand.forEach(y => validateCard(y)));
    newSession.deck.forEach(x => validateCard(x));
    newSession.discard.forEach(x => validateCard(x));
    newSession.playHistory.forEach(x => validateCard(x.card));

    return newSession;
}

export function validateSimpleSession(session: SimpleSession): SimpleSession {
    const newSession = {
        name: session.name?.trim(),
        game: session.game?.trim(),
        host: session.host?.trim(),
    };

    if (!newSession.name)
        throw userError('Name cannot be empty');
    if (!newSession.game)
        throw userError('Game cannot be empty');
    if (!newSession.host)
        throw userError('Host cannot be empty');

    return newSession;
}

export function overwriteSession(session: Partial<Session>, current: Session): Session {
    const newSession = {
        name: session.name ?? current.name,
        game: session.game ?? current.game,
        host: session.host ?? current.host,
        deck: session.deck ?? current.deck,
        discard: session.discard ?? current.discard,
        playHistory: session.playHistory ?? current.playHistory,
        players: session.players ? current.players.map(x => {
            return session.players!.find(y => y.name === x.name) ?? x;
        }) : current.players
    };

    return newSession;
}

export function uuid(): string {
    return v1();
}