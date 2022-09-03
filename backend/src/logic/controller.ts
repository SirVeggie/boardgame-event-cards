import { CardType, GameEvent, PlayerEvent, PLAYER_EVENT, PublicSession, Session, SessionEvent, SESSION_EVENT, SimpleSession, SYNC_EVENT, userError } from 'shared';
import { sendAll, sendError, sendEvent, subscribeEvent, syncLobbies } from '../networking/socket';
import { getCards } from '../tools/cards';
import { getGame } from '../tools/games';
import { randomIndex } from '../tools/utils';

const sessions: Record<string, Session> = {};

export function startController() {
    
    subscribeEvent<SessionEvent>(SESSION_EVENT, (event, ws) => {
        if (!sessions[event.session])
            return sendError(ws, 'Invalid session');
        const session = sessions[event.session];

        if (event.action === 'join') {
            if (!session.players.some(x => x.name === event.player))
                session.players.push({ name: event.player, hand: [] });
            sendEvent(event);

        } else if (event.action === 'leave') {
            const index = session.players.findIndex(x => x.name === event.player);
            if (index === -1)
                return sendError(ws, 'Invalid player');
            console.log(`players: ${session.players.length} - ${session.players.map(x => x.name)}`);
            const player = session.players.splice(index, 1)[0];
            console.log(`players: ${session.players.length} - ${session.players.map(x => x.name)}`);
            player.hand.forEach(x => session.discard.push(x));
            if (session.players.length === 0)
                removeSession(event.session);
            sendEvent(event);
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
            sendEvent({ ...event, card: card });

        } else if (event.action === 'discard') {
            const cardIndex = player.hand.findIndex(x => x.title === event.card!.title);
            const card = player.hand.splice(cardIndex, 1)[0];
            session.discard.push(card);
            sendEvent(event);

        } else if (event.action === 'play') {
            const cardIndex = player.hand.findIndex(x => x.title === event.card!.title);
            if (cardIndex === -1)
                return sendError(ws, 'You do not have that card');
            const card = player.hand.splice(cardIndex, 1)[0];
            session.playHistory.push({ card, player: event.player });
            sendEvent(event, true);
        }

        updateClients(event);
    });
}

function updateClients(source: GameEvent) {
    const session = sessions[source.session];
    if (!session)
        return;
    sendAll(source.session, x => {
        if (!session.players.some(y => y.name === x.player))
            throw Error('Could not find player in session');
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
        discardEmpty: session.discard.length === 0,
        playHistory: session.playHistory,
    };
}

export function addSession(session: SimpleSession) {
    if (sessions[session.name])
        throw userError('Session already exists');

    const newSession: Session = {
        ...session,
        deck: getCards(getGame(session.game).name),
        discard: [],
        playHistory: [],
        players: [
            {
                name: session.host,
                hand: []
            }
        ],
    };

    sessions[session.name] = newSession;

    return convertToPublic(newSession);
}

export function removeSession(name: string) {
    if (!sessions[name])
        throw userError('Session not found');
    delete sessions[name];
    syncLobbies();
}