import { useEffect, useState } from 'react';
import { WebEvent } from 'shared';
import ReconnectingWebSocket from 'reconnecting-websocket';

export function useLocalSocket(data: WebEvent, onmessage?: (data: any, ws: ReconnectingWebSocket) => void) {
    const host = window.location.host;
    const secure = window.location.protocol === 'https:' ? 's' : '';
    const url = host.includes('localhost') ? 'ws://localhost:3001' : `ws${secure}://${host}`;
    return useWebSocket(url, ws => ws.send(JSON.stringify(data)), onmessage);
}

export function useWebSocket(url: string, onOpen?: (ws: ReconnectingWebSocket) => void, onmessage?: (data: any, ws: ReconnectingWebSocket) => void) {
    const [ws, setWS] = useState<ReconnectingWebSocket>();
    
    const send = (data: any) => {
        if (ws) {
            ws.send(JSON.stringify(data));
        }
    };

    useEffect(() => {
        const socket = new ReconnectingWebSocket(url);

        socket.onopen = () => {
            onOpen?.call(null, socket);
        };

        socket.onmessage = event => {
            onmessage?.call(null, JSON.parse(event.data), socket);
        };

        setWS(socket);

        return () => {
            socket.onmessage = null;
            socket.onclose = null;
            socket.close();
        };
    }, []);

    return {
        send,
        isOpen: () => ws?.readyState === ws?.OPEN,
    };
}