import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PublicSession } from 'shared';

export const sessionSlice = createSlice({
    name: 'sessions',
    initialState: [] as PublicSession[],
    reducers: {
        setSessions: (state, action: PayloadAction<PublicSession[]>) => {
            state.splice(0, state.length);
            action.payload.forEach(session => state.push(session));
        },
        
        modifySession: (state, action: PayloadAction<PublicSession>) => {
            const index = state.findIndex(session => session.name === action.payload.name);
            state[index] = action.payload;
        },
        
        addSession: (state, action: PayloadAction<PublicSession>) => {
            state.push(action.payload);
        },
    }
});

export const sessionReducer = sessionSlice.reducer;
export const { setSessions, modifySession, addSession } = sessionSlice.actions;