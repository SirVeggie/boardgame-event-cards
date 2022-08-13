import { Server } from 'http';
import { GameEvent, SESSION_EVENT, WebEvent, wsError } from 'shared';
import { WebSocket, WebSocketServer } from 'ws';

type Actor = { player: string, ws: WebSocket; };
let wss: WebSocketServer = null as any;
const actions: Record<WebEvent['type'], ((data: WebEvent, ws: WebSocket) => void)[]> = {} as any;
const sessions: Record<string, Actor[]> = {};

export function createSocket(port: number): void;
export function createSocket(server: Server): void;
export function createSocket(a: number | Server) {
    if (typeof a === 'number') {
        wss = new WebSocketServer({ port: a });
        createSocketBase();
    } else {
        wss = new WebSocketServer({ server: a });
        createSocketBase();
    }
}

function createSocketBase() {
    wss.on('connection', ws => {
        console.log('client connected');

        ws.onmessage = event => handleMessage(event.data as string, ws);
        ws.onclose = () => {
            console.log('client disconnected');
            removeWsConnection(ws);
        };
    });
}

export function subscribeEvent<T extends WebEvent>(event: T['type'], func: (event: T, ws: WebSocket) => void): void {
    if (!actions[event])
        actions[event] = [];
    actions[event].push(func as any);
}

export function sendEvent(event: GameEvent, includeSelf?: boolean) {
    sessions[event.session]?.forEach(x => {
        if (x.player !== event.player || includeSelf) {
            x.ws.send(JSON.stringify(event));
        }
    });
}

export function sendError(ws: WebSocket, error: string) {
    ws.send(JSON.stringify(wsError(error)));
}

export function sendAll(session: string, action: (player: Actor) => WebEvent) {
    if (!sessions[session])
        return console.log(`Session ${session} is empty at sendAll`);
    console.log(`Sending all players in session ${session} ${sessions[session]}`);
    // Runs conversions first before sending events to avoid sending partially if errors occur
    const messages = sessions[session].map(x => ({ actor: x, action: action(x) }));
    messages.forEach(x => x.actor.ws.send(JSON.stringify(x.action)));
}

function handleMessage(message: string, ws: WebSocket) {
    const event = JSON.parse(message) as WebEvent;
    console.log(`Incoming event: ${event.type} ${(event as any).action ? `action: ${(event as any).action}` : ''}`);

    handleJoin(event, ws);
    handleLeave(event, ws);
    actions[event.type]?.forEach(x => x(event, ws));
}

function handleJoin(event: WebEvent, ws: WebSocket) {
    if (event.type !== SESSION_EVENT || event.action !== 'join')
        return;
    if (!sessions[event.session])
        sessions[event.session] = [];
    sessions[event.session].push({ player: event.player, ws });
}

function handleLeave(event: WebEvent, ws: WebSocket) {
    if (event.type !== SESSION_EVENT || event.action !== 'leave')
        return;
    removeWsConnection(ws);
}

function removeWsConnection(ws: WebSocket) {
    Object.keys(sessions).forEach(x => {
        const index = sessions[x].findIndex(y => y.ws === ws);
        if (index !== -1)
            sessions[x].splice(index, 1);
        if (sessions[x].length === 0)
            delete sessions[x];
    });
    
    ws.close();
}

