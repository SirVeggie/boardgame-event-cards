import { Router } from 'express';
import { addSession, getSessions } from '../../logic/controller';

export const sessionRouter = Router();

sessionRouter.get('/', (req, res) => {
    res.send(getSessions());
});

sessionRouter.post('/', (req, res) => {
    addSession(req.body);
    res.status(201).end();
});
