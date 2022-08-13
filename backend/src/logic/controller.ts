import { CardType, GameEvent, PlayerEvent, PLAYER_EVENT, PublicSession, Session, SessionEvent, SESSION_EVENT, SimpleSession, SYNC_EVENT, userError } from 'shared';
import { sendAll, sendError, sendEvent, subscribeEvent } from '../networking/socket';
import { getCards } from '../tools/cards';
import { getGame } from '../tools/games';
import { randomIndex } from '../tools/utils';

const sessions: Record<string, Session> = {};

subscribeEvent<SessionEvent>(SESSION_EVENT, (event, ws) => {
    if (!sessions[event.session])
        return sendError(ws, 'Invalid session');
    const session = sessions[event.session];
    
    if (event.action === 'join') {
        session.players.push({ name: event.player, hand: [] });
        sendEvent(event);
    } else if (event.action === 'leave') {
        const index = session.players.findIndex(x => x.name === event.player);
        if (index === -1)
            return sendError(ws, 'Invalid player');
        const player = session.players.splice(index, 1)[0];
        player.hand.forEach(x => session.discard.push(x));
        sendEvent(event);
    // } else if (event.action === 'start') {
        
    // } else if (event.action === 'end') {
        
    }

    updateClients(event);
});

subscribeEvent<PlayerEvent>(PLAYER_EVENT, (event, ws) => {
    if (!sessions[event.session])
        return sendError(ws, 'Invalid session');
    const session = sessions[event.session];
    const player = session.players.find(x => x.name === event.player);
    if (!player)
        return sendError(ws, 'Invalid player');

    if (event.action === 'draw') {
        if (session.deck.length === 0)
            return sendError(ws, 'Deck is empty');
        const card: CardType = session.deck.splice(randomIndex(session.deck), 1)[0];
        player.hand.push(card);
        sendEvent(event);

    } else if (event.action === 'discard') {
        const cardIndex = player.hand.findIndex(x => x.title === event.card);
        const card = player.hand.splice(cardIndex, 1)[0];
        session.discard.push(card);
        sendEvent(event);

    } else if (event.action === 'play') {
        const cardIndex = player.hand.findIndex(x => x.title === event.card);
        player.hand.splice(cardIndex, 1);
        sendEvent(event, true);
    }

    updateClients(event);
});

function updateClients(source: GameEvent) {
    const session = sessions[source.session];
    sendAll(source.session, x => {
        if (!session.players.some(y => y.name === x.player))
            throw Error('Invalid player');
        return ({
            type: SYNC_EVENT,
            session: {
                ...convertToPublic(session),
                me: {
                    name: x.player,
                    hand: session.players.find(y => y.name === x.player)!.hand,
                }
            }
        });
    });
}



export function getSessions(): PublicSession[] {
    return Object.values(sessions).map(x => convertToPublic(x));
}

function convertToPublic(session: Session): PublicSession {
    return {
        name: session.name,
        game: session.game,
        host: session.host,
        players: session.players.map(x => x.name),
        deckEmpty: session.deck.length === 0,
        discardEmpty: session.discard.length === 0
    };
}

export function addSession(session: SimpleSession) {
    if (sessions[session.name])
        throw userError('Session already exists');

    const newSession: Session = {
        ...session,
        deck: getCards(getGame(session.game).name),
        discard: [],
        players: [
            {
                name: session.host,
                hand: []
            }
        ],
    };

    sessions[session.name] = newSession;
}

export function removeSession(name: string) {
    if (!sessions[name])
        throw userError('Session not found');
    delete sessions[name];
}