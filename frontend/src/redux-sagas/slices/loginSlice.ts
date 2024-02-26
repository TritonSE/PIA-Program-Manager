import { createSlice } from "@reduxjs/toolkit";

import type { User } from "../../api/data";
import type { LoginError, SignUpError } from "../error_handling/auth";
import type { RootState } from "../store";
import type { PayloadAction } from "@reduxjs/toolkit";

export type authState = {
  value: boolean;
  user: User | null;
  loginError: LoginError;
  signUpError: SignUpError;
};

const initialState: authState = {
  value: false,
  user: null,
  loginError: {
    authError: "",
    unknownError: "",
  },
  signUpError: {
    unknownError: "",
    passwordError: "",
    confirmError: "",
    emailError: "",
    nameError: "",
  },
};
export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state: authState, action: PayloadAction<User>) => {
      console.log(action);
      state.value = true;
      state.user = action.payload;
    },
    logout: (state: authState) => {
      state.value = false;
      state.user = null;
    },
    setLoginError: (state: authState, action: PayloadAction<LoginError>) => {
      state.loginError = action.payload;
    },
    setSignUpError: (state: authState, action: PayloadAction<SignUpError>) => {
      state.signUpError = action.payload;
    },
  },
});
export const { login, logout, setLoginError, setSignUpError } = loginSlice.actions;

export const selectLogin = (state: RootState): boolean => state.login.value;
export const selectLoginError = (state: RootState): LoginError => state.login.loginError;

export const selectSignUpError = (state: RootState): SignUpError => state.login.signUpError;
export const selectUser = (state: RootState): User | null => state.login.user;

export default loginSlice.reducer;
