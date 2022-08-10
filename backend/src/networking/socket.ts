import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';

let wss: WebSocketServer = null as any;
const actions: Record<string, ((data: string, ws: WebSocket) => void)[]> = {};

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
        ws.onclose = () => console.log('client disconnected');
        ws.onmessage = event => handleMessage(event.data as string, ws);
    });
}

export function subscribeCommand(command: string, action: (data: string, ws: WebSocket) => void): void {
    if (!actions[command])
        actions[command] = [];
    actions[command].push(action);
}

export function sendCommand(command: string, data?: string) {
    wss.clients.forEach(x => {
        x.send(JSON.stringify({ [command]: data ?? '' }));
    });
}

function handleMessage(message: string, ws: WebSocket) {
    const record = JSON.parse(message) as Record<string, string>;
    console.log(`Incoming command: ${record}`);

    for (const [command, data] of Object.entries(record)) {
        actions[command]?.forEach(x => x(data, ws));
    }
}
