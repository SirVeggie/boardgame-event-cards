import { useCallback, useEffect, useRef, useState } from 'react';

export function useKeyEvent(targetKey: string, repeat?: boolean) {
    const [, updateState] = useState(null as any);
    const forceUpdate = useCallback(() => updateState({}), []);
    const pressed = useRef(false);
    const down = useRef(false);

    const oldPressed = pressed.current;
    if (pressed.current) {
        pressed.current = false;
    }

    const downHandler = (event: KeyboardEvent) => {
        if (event.key.toLocaleLowerCase() === targetKey.toLocaleLowerCase()) {

            if (repeat || !down.current) {
                down.current = true;
                pressed.current = true;
                forceUpdate();
            }
        }
    };

    const upHandler = (event: KeyboardEvent) => {
        if (event.key.toLocaleLowerCase() === targetKey.toLocaleLowerCase()) {
            down.current = false;
            forceUpdate();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);
    return { down: down.current, pressed: oldPressed };
}