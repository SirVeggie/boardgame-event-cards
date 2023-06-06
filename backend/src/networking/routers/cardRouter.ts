import { Router } from 'express';
import { addCard, generateCard, getCards, removeCard, saveCards, updateCard } from '../../tools/cards';
import { getGames } from '../../tools/games';

export const cardRouter = Router();

cardRouter.get('/', (req, res) => {
    res.send(getCards());
});

cardRouter.post('/', (req, res) => {
    const card = addCard(req.body);
    saveCards();
    res.status(201).send(card);
});

cardRouter.put('/', (req, res) => {
    const card = updateCard(req.body);
    saveCards();
    res.status(200).send(card);
});

cardRouter.delete('/:title', (req, res) => {
    removeCard(decodeURIComponent(req.params.title));
    saveCards();
    res.status(204).end();
});



cardRouter.get('/generate/:game', async (req, res) => {
    if (!getGames().some(x => x.name === req.params.game))
        return res.status(404);
    const card = await generateCard(decodeURIComponent(req.params.game));
    if (!card)
        return res.status(500);
    res.status(200).send(card);
});