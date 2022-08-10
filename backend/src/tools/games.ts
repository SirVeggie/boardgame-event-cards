import { GameInfo, userError, validateGame } from 'shared';
import { loadJson, saveJson } from './jsonFiles';

const obj = {
    games: [] as GameInfo[]
};
const gameLocation = './data/games.txt';

export function getGames(): GameInfo[] {
    return obj.games;
}

export function addGame(game: GameInfo): GameInfo {
    if (obj.games.some(x => x.name === game.name))
        throw userError('Game already exists');
    const res = validateGame(game);
    obj.games.push(res);
    return res;
}

export function removeGame(name: string): void {
    const index = obj.games.findIndex(x => x.name === name);
    if (index === -1)
        throw userError('Game not found');
    obj.games.splice(index, 1);
}

export function updateGame(game: GameInfo): GameInfo {
    const index = obj.games.findIndex(x => x.name === game.name);
    if (index === -1)
        throw userError('Game not found');
    const res = validateGame(game);
    obj.games[index] = res;
    return res;
}

export async function loadGames() {
    obj.games = await loadJson(gameLocation) ?? [];
}

export function saveGames() {
    saveJson(gameLocation, obj.games, true);
}