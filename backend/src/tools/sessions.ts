import { overwriteSession, userError, validateSession } from 'shared';
import { Session } from 'shared/src/types';
import { loadJson, saveJson } from './jsonFiles';

const obj = {
    sessions: [] as Session[]
};
const sessionLocation = './data/sessions.txt';

export function getSessions(): Session[] {
    return obj.sessions;
}

export function addSession(session: Session): Session {
    if (obj.sessions.some(x => x.game === session.game))
        throw userError('Session already exists');
    const res = validateSession(session);
    obj.sessions.push(res);
    return res;
}

export function removeSession(game: string): void {
    const index = obj.sessions.findIndex(x => x.game === game);
    if (index === -1)
        throw userError('Session not found');
    obj.sessions.splice(index, 1);
}

export function updateSession(session: Session): Session {
    const index = obj.sessions.findIndex(x => x.game === session.game);
    if (index === -1)
        throw userError('Session not found');
    const res = validateSession(overwriteSession(session, obj.sessions[index]));
    obj.sessions[index] = res;
    return res;
}

export async function loadSessions() {
    obj.sessions = await loadJson(sessionLocation) ?? [];
}

export function saveSessions() {
    saveJson(sessionLocation, obj.sessions, true);
}