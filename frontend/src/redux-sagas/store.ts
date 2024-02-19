import {
    configureStore,
    type ThunkAction,
    type Action,
  } from "@reduxjs/toolkit";
  import loginReducer from "./slices/loginSlice";
  import createSagaMiddleware from "redux-saga";
  import rootSaga from "./sagas/rootSaga";
  import registerSaga from "./sagas/authSaga";
  
  // Create the saga middleware
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  export const store = configureStore({
    reducer: {
      login: loginReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),
  });
  
  // Then run the saga
  // uncomment when root saga is made
  sagaMiddleware.run(registerSaga);
  sagaMiddleware.run(rootSaga);
  
  export type AppDispatch = typeof store.dispatch;
  export type RootState = ReturnType<typeof store.getState>;
  export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
  >;