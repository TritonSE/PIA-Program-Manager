import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

import { loginUser, register } from "../../api/auth";
import { LoginError, SignUpError, logInErrorHandler, signUpErrorHandler } from "../error_handling/auth";
import { login, setLoginError, setSignUpError } from "../slices/loginSlice";

import { LoginRequest } from "./data";

import type { LoginResult } from "../../api/data";


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

// Saves the new user to the server
// function* saveUser({ payload }: any): Generator<any> {
//   const userEmail: string = payload.email;
//   // const userDetails: UserDetails = {
//   //   // phone: payload.phone,
//   //   // address: payload.address,
//   //   // city: payload.city,
//   //   // state: payload.state,
//   //   // zipCode: payload.zipCode,
//   //   // country: payload.country,
//   // };
//   // yield call(updateUserDetails, payload.email, userDetails);
//   yield put({ type: "STORE_USER", payload: userEmail });
// }

function* authenticateUser({ payload }: any): Generator<any> {
  try {
    const response: LoginResult = (yield call(
      loginUser,
      payload.email,
      payload.password,
    )) as LoginResult;
    yield put(login(response));
    // payload.navigate("/");
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = yield call(logInErrorHandler, error);
      yield put(setLoginError(errorMessage as LoginError));
      // payload.navigate("/login");
    }
  }
}

// function* registerUser({ payload }: any): Generator<any> {
//   try {
//     yield call(
//       register,
//       payload.userDisplayName,
//       payload.registerEmail,
//       payload.agreedTerms,
//       payload.registerPassword,
//       payload.confirmPassword,
//     );
//     yield put({ type: "STORE_USER", payload: payload.registerEmail });
//     payload.navigate("/signupdetails");
//   } catch (error) {
//     if (error instanceof Error) {
//       const errorMessage = yield call(signUpErrorHandler, error);
//       yield put(setSignUpError(errorMessage as SignUpError));
//       payload.navigate("/signup");
//     }
//   }
// }

function* registerSaga(): Generator<any> {
  yield takeLatest("LOGIN_USER", authenticateUser);
  // yield takeEvery("SAVE_USER", saveUser);
  // yield takeEvery("REGISTER_USER", registerUser);
}

export default registerSaga;
