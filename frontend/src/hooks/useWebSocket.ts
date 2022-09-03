import { useEffect, useState } from 'react';
import { WebEvent } from 'shared';
import { useNotification } from './useNotification';

export function useLocalSocket(data: WebEvent, onmessage?: (data: any, ws: WebSocket) => void) {
    const host = window.location.host;
    const secure = window.location.protocol === 'https:' ? 's' : '';
    const url = host.includes('localhost') ? 'ws://localhost:3001' : `ws${secure}://${host}`;
    return useWebSocket(url, ws => ws.send(JSON.stringify(data)), onmessage);
}

export function useWebSocket(url: string, onOpen?: (ws: WebSocket) => void, onmessage?: (data: any, ws: WebSocket) => void) {
    const [count, setCount] = useState(0);
    const [connected, setConnected] = useState(false);
    const [ws, setWS] = useState(null as unknown as WebSocket);
    const notify = useNotification();

    console.log(ws ? 'ws is real' : 'ws is null');
    
    const send = (data: any) => {
        if (ws) {
            ws.send(JSON.stringify(data));
        }
    };
    
    const fixConnection = () => {
        notify.create('info', ws ? 'ws is real' : 'ws is null');
        if (!ws)
            console.log('ws is definitely not real');
        if (ws.readyState !== WebSocket.OPEN) {
            setCount(count + 1);
        }
    };

    useEffect(() => {
        ws?.close();
        const newWS = new WebSocket(url);

        newWS.onopen = () => {
            setConnected(true);
            onOpen?.call(null, newWS);
        };

        newWS.onclose = (status) => {
            notify.create('error', 'Websocket disconnected');
            setConnected(false);
            if (status.code !== 1000) {
                console.log(`Websocket closed with status ${status.code} - ${status.reason}`);
                fixConnection();
            }
        };

        newWS.onmessage = event => {
            onmessage?.call(null, JSON.parse(event.data), newWS);
        };

        setWS(newWS);

        return () => {
            newWS.onmessage = null;
            newWS.onclose = null;
            newWS.close();
        };
    }, [count]);

    useEffect(() => {
        if ('wakeLock' in navigator)
            notify.create('success', 'Wake lock is supported');
        else
            notify.create('error', 'Wake lock is not supported');
        window.addEventListener('focus', fixConnection);
        return () => window.removeEventListener('focus', fixConnection);
    }, []);

    return [send, connected] as [(data: any) => void, boolean];
}