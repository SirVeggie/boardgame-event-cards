import { useCallback, useEffect, useState } from 'react';

export function useKeyEvent(targetKey: string, repeat?: boolean) {
    const [{ down, pressed, count }, setState] = useState({ down: false, pressed: false, count: 0 });
    // console.log(`count: ${count} | down: ${down} | pressed: ${pressed}`);

    if (pressed) {
        setState({ down, pressed: false, count: count + 1 });
    }

    const downCallback = useCallback((e: KeyboardEvent) => {
        if (e.key.toLocaleLowerCase() === targetKey.toLocaleLowerCase()) {

            if (repeat || !down) {
                setState({ down: true, pressed: true, count: count + 1 });
            }
        }
    }, [repeat, down]);

    const upCallback = (e: KeyboardEvent) => {
        if (e.key.toLocaleLowerCase() === targetKey.toLocaleLowerCase()) {
            setState({ down: false, pressed, count: count + 1 });
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', downCallback);
        window.addEventListener('keyup', upCallback);

        return () => {
            window.removeEventListener('keydown', downCallback);
            window.removeEventListener('keyup', upCallback);
        };
    }, [downCallback, upCallback]);
    return { down, pressed };
}