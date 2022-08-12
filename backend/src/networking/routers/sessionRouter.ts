import { Router } from 'express';
import { addSession, getSessions, removeSession, saveSessions, updateSession } from '../../tools/sessions';

export const sessionRouter = Router();

sessionRouter.get('/', (req, res) => {
    res.send(getSessions());
});

sessionRouter.post('/', (req, res) => {
    const session = addSession(req.body);
    saveSessions();
    res.status(201).send(session);
});

sessionRouter.put('/', (req, res) => {
    const session = updateSession(req.body);
    saveSessions();
    res.status(200).send(session);
});

sessionRouter.delete('/:game', (req, res) => {
    removeSession(decodeURIComponent(req.params.game));
    saveSessions();
    res.status(204).end();
});