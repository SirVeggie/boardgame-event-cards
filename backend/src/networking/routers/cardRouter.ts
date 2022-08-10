import { Router } from 'express';
import { addCard, getCards, removeCard, saveCards } from '../../tools/cards';

export const cardRouter = Router();

cardRouter.get('/', (req, res) => {
    res.send(getCards());
});

cardRouter.post('/', (req, res) => {
    const card = addCard(req.body);
    saveCards();
    res.status(201).send(card);
});

cardRouter.delete('/:title', (req, res) => {
    removeCard(decodeURIComponent(req.params.title));
    saveCards();
    res.status(204).end();
});