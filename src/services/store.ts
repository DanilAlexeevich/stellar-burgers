import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import userReducer from './slices/userSlice';
import userOrdersReducer from './slices/userOrdersSlice';
import orderReducer from './slices/orderSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructor: constructorReducer,
  feed: feedReducer,
  user: userReducer,
  userOrders: userOrdersReducer,
  order: orderReducer
});

const preloadedState = {
  constructor: {
    bun: null,
    ingredients: []
  }
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
