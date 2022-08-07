import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardType } from 'shared/src/types';

export const cardSlice = createSlice({
    name: 'cards',
    initialState: [] as CardType[],
    reducers: {
        setCards: (state, action: PayloadAction<CardType[]>) => {
            state.splice(0, state.length);
            action.payload.forEach(card => state.push(card));
        }
    }
});

export const cardReducer = cardSlice.reducer;
export const { setCards } = cardSlice.actions;