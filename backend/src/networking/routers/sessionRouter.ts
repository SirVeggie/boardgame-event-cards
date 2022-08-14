import { Router } from 'express';
import { validateSimpleSession } from 'shared';
import { addSession, getSessions } from '../../logic/controller';

export const sessionRouter = Router();

sessionRouter.get('/', (req, res) => {
    res.send(getSessions());
});

sessionRouter.post('/', (req, res) => {
    const val = validateSimpleSession(req.body);
    const result = addSession(val);
    res.status(201).send(result);
});
