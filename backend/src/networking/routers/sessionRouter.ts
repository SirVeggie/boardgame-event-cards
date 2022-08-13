import { Router } from 'express';
import { addSession, getSessions } from '../../logic/controller';

export const sessionRouter = Router();

sessionRouter.get('/', (req, res) => {
    res.send(getSessions());
});

sessionRouter.post('/', (req, res) => {
    const result = addSession(req.body);
    res.status(201).send(result);
});
