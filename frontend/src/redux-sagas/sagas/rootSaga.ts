import { all } from "redux-saga/effects";
 // Import your saga file(s)
 import registerSaga from "./authSaga";
// add all Sagas here to ensure they run

function* rootSaga(): Generator<any> {
  yield all([

    // Add other sagas here if needed
    registerSaga(),
  ]);
}

export default rootSaga;