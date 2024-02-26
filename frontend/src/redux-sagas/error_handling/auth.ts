export type LoginError = {
  authError: string;
  unknownError: string;
};

export type SignUpError = {
  unknownError: string;
  passwordError: string;
  confirmError: string;
  emailError: string;
  nameError: string;
};

const defaultLoginError = {
  authError: "",
  unknownError: "",
};

const defaultSignUpError = {
  unknownError: "",
  passwordError: "",
  confirmError: "",
  emailError: "",
  nameError: "",
};

const signUpErrorHandler = (error: Error): SignUpError => {
  const errorMessage = error.message;

  if (errorMessage.includes("internal-error")) {
    return {
      ...defaultSignUpError,
      unknownError: "Internal error. Make sure you have typed a valid password.",
    };
  } else if (errorMessage.includes("invalid-email")) {
    return {
      ...defaultSignUpError,
      emailError: "The email is invalid. Try again with a valid email.",
    };
  } else if (errorMessage.includes("weak-password")) {
    return {
      ...defaultSignUpError,
      passwordError: "The password is invalid. It should be at least 6 characters.",
    };
  } else if (errorMessage.includes("email-already-in-use")) {
    return {
      ...defaultSignUpError,
      emailError: "This email is already in use. Try signing in or using a different email.",
    };
  } else {
    return {
      ...defaultSignUpError,
      unknownError: errorMessage,
    };
  }
};

const logInErrorHandler = (error: Error): LoginError => {
  const errorMessage = error.message;

  if (errorMessage.includes("Login Failed.")) {
    return {
      ...defaultLoginError,
      authError: "Login error. Please check your email and password.",
    };
  } else {
    return {
      ...defaultLoginError,
      unknownError: "Internal server error. Please contact an admin for details.",
    };
  }
};

export { signUpErrorHandler, logInErrorHandler };
