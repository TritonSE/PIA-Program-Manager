import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from "../store";
import { type LoginError, type SignUpError } from "../error_handling/auth";

import { type User } from "../../api/data";

export interface LoginState {
  value: boolean;
  loadingUser: boolean;
  user: User | null;
  loginError: LoginError;
  signUpError: SignUpError;
}

const initialState: LoginState = {
  value: false,
  loadingUser: true,
  user: null,
  loginError: {
    emailError: "",
    passwordError: "",
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
    login: (state) => {
      state.value = true;
    },
    logout: (state) => {
      state.value = false;
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    storeUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loadingUser = false;
    },
    setLoginError: (state, action) => {
      state.loginError = action.payload;
    },
    setSignUpError: (state, action) => {
      state.signUpError = action.payload;
    },
  },
});
export const { login, logout, storeUser, setLoginError, setSignUpError, updateUser } =
  loginSlice.actions;

export const selectLogin = (state: RootState): boolean => state.login.value;
export const selectLoadingUser = (state: RootState): boolean => state.login.loadingUser;

export const selectLoginError = (state: RootState): LoginError => state.login.loginError;

export const selectSignUpError = (state: RootState): SignUpError => state.login.signUpError;
export const selectUser = (state: RootState): User | null => state.login.user;

export default loginSlice.reducer;
