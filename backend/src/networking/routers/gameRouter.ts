import { Router } from 'express';
import { addGame, getGames, removeGame, saveGames, updateGame } from '../../tools/games';

export const gameRouter = Router();

gameRouter.get('/', (req, res) => {
    res.send(getGames());
});

gameRouter.post('/', (req, res) => {
    const game = addGame(req.body);
    saveGames();
    res.status(201).send(game);
});

gameRouter.put('/', (req, res) => {
    const game = updateGame(req.body);
    saveGames();
    res.status(200).send(game);
});

gameRouter.delete('/:name', (req, res) => {
    removeGame(decodeURIComponent(req.params.name));
    saveGames();
    res.status(204).end();
});