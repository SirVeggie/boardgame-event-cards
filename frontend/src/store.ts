import { configureStore } from '@reduxjs/toolkit';
import { cardReducer } from './reducers/cardReducer';
import { gameReducer } from './reducers/gameReducer';
import { notificationReducer } from './reducers/notificationReducer';

export const store = configureStore({
    reducer: {
        notifications: notificationReducer,
        cards: cardReducer,
        games: gameReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;