import { v1 } from 'uuid';
import { CardType, GameInfo } from './types';

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

export function uuid(): string {
    return v1();
}