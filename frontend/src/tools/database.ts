import axios from 'axios';
import { CardType, GameInfo } from 'shared/src/types';
import { cardPath, gamePath } from 'shared';

function handleError(reason: any): any {
    if (reason.response?.status?.toString().startsWith('4'))
        if (reason.response.data)
            throw { ...reason.response.data, status: reason.response.status };
    throw reason;
}

export function getCards(): Promise<CardType[]> {
    return axios.get(cardPath)
        .then(res => res.data)
        .catch(handleError);
}

export function addCard(card: CardType): Promise<CardType> {
    return axios.post(cardPath, card)
        .then(res => res.data)
        .catch(handleError);
}

export function removeCard(title: string): Promise<void> {
    return axios.delete(`${cardPath}/${encodeURIComponent(title)}`)
        .catch(handleError);
}

export function getGames(): Promise<GameInfo[]> {
    return axios.get(gamePath)
        .then(res => res.data)
        .catch(handleError);
}

export function addGame(game: GameInfo): Promise<GameInfo> {
    return axios.post(gamePath, game)
        .then(res => res.data)
        .catch(handleError);
}

export function removeGame(name: string): Promise<void> {
    return axios.delete(`${gamePath}/${encodeURIComponent(name)}`)
        .catch(handleError);
}