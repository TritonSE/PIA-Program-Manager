import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { type Effect } from "redux-saga/effects";
import { login, storeUser, setLoginError, setSignUpError, logout } from "../slices/loginSlice";
import { logInErrorHandler, signUpErrorHandler } from "../error_handling/auth";
import {
  register,
  loginUser,
  getUser
} from "../../api/auth";
import { type PayloadAction } from "@reduxjs/toolkit";
import { type User } from "../../api/data";
// import { updateUserDetails } from "../api/consumer";
/*
const fetchUser = () => {};
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
function* mySaga() {
    yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
  }
  export default mySaga;
*/

function* setUser(action: PayloadAction<string>): Generator<Effect, void, any> {
  const user: User | null = yield call(getUser, action.payload);
  if (user === null) {
    yield put(logout());
  } else {
    yield put(storeUser(user));
    yield put(login());
  }
}

// Saves the new user to the server
function* saveUser({ payload }: any): Generator<any> {
  const userEmail: string = payload.email;
  // const userDetails: UserDetails = {
  //   // phone: payload.phone,
  //   // address: payload.address,
  //   // city: payload.city,
  //   // state: payload.state,
  //   // zipCode: payload.zipCode,
  //   // country: payload.country,
  // };
  // yield call(updateUserDetails, payload.email, userDetails);
  yield put({ type: "STORE_USER", payload: userEmail });
}

function* authenticateUser({ payload }: any): Generator<any> {
  try {
    yield call(loginUser, payload.loginPassword, payload.rememberUser, payload.loginEmail);
    yield put(login());
    payload.navigate("/");
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = yield call(logInErrorHandler, error);
      yield put(setLoginError(errorMessage));
      payload.navigate("/login");
    }
  }
}

function* registerUser({ payload }: any): Generator<any> {
  try {
    yield call(
      register,
      payload.userDisplayName,
      payload.registerEmail,
      payload.agreedTerms,
      payload.registerPassword,
      payload.confirmPassword,
    );
    yield put({ type: "STORE_USER", payload: payload.registerEmail });
    payload.navigate("/signupdetails");
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = yield call(signUpErrorHandler, error);
      yield put(setSignUpError(errorMessage));
      payload.navigate("/signup");
    }
  }
}

function* registerSaga(): Generator<any> {
  yield takeLatest("LOGIN_USER", authenticateUser);
  yield takeEvery("SAVE_USER", saveUser);
  yield takeEvery("STORE_USER", setUser);
  yield takeEvery("REGISTER_USER", registerUser);
}

export default registerSaga;
