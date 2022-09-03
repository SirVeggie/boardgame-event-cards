import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameInfo } from 'shared';

export const gameSlice = createSlice({
    name: 'games',
    initialState: [] as GameInfo[],
    reducers: {
        setGames: (state, action: PayloadAction<GameInfo[]>) => {
            state.splice(0, state.length);
            action.payload.forEach(game => state.push(game));
        }
    }
});

export const gameReducer = gameSlice.reducer;
export const { setGames } = gameSlice.actions;