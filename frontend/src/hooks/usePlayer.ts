import { useParams } from 'react-router-dom';

export function usePlayer() {
    const player = decodeURIComponent(useParams().player ?? '');
    return player;
}