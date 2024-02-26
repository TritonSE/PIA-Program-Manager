import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas/rootSaga";
import loginReducer from "./slices/loginSlice";

const sagaMiddleware = createSagaMiddleware();

const redux_store = configureStore({
  reducer: {
    login: loginReducer,
    // add other reducers here
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([sagaMiddleware]),
});

sagaMiddleware.run(rootSaga);


export type AppDispatch = typeof redux_store.dispatch;
export type RootState = ReturnType<typeof redux_store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;

export const wrapper = createWrapper(() => redux_store, { debug: true });
