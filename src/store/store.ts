import { configureStore } from '@reduxjs/toolkit';
import wsReducer from './wsSlice';

export const store = configureStore({
  reducer: {
    ws: wsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
