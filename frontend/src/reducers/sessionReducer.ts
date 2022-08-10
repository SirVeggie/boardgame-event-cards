import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from 'shared/src/types';

export const sessionSlice = createSlice({
    name: 'sessions',
    initialState: [] as Session[],
    reducers: {
        setSessions: (state, action: PayloadAction<Session[]>) => {
            state.splice(0, state.length);
            action.payload.forEach(session => state.push(session));
        },
        
        modifySession: (state, action: PayloadAction<Session>) => {
            const index = state.findIndex(session => session.name === action.payload.name);
            state[index] = action.payload;
        }
    }
});

export const sessionReducer = sessionSlice.reducer;
export const { setSessions, modifySession } = sessionSlice.actions;