export interface LoginError {
    emailError: string;
    passwordError: string;
    unknownError: string;
  }
  
  export interface SignUpError {
    unknownError: string;
    passwordError: string;
    confirmError: string;
    emailError: string;
    nameError: string;
  }
  
  const defaultLoginError = {
    emailError: "",
    passwordError: "",
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
        unknownError:
          "Internal error. Make sure you have typed a valid password.",
      };
    } else if (errorMessage.includes("invalid-email")) {
      return {
        ...defaultSignUpError,
        emailError: "The email is invalid. Try again with a valid email.",
      };
    } else if (errorMessage.includes("weak-password")) {
      return {
        ...defaultSignUpError,
        passwordError:
          "The password is invalid. It should be at least 6 characters.",
      };
    } else if (errorMessage.includes("email-already-in-use")) {
      return {
        ...defaultSignUpError,
        emailError:
          "This email is already in use. Try signing in or using a different email.",
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
  
    if (errorMessage.includes("user-not-found")) {
      return {
        ...defaultLoginError,
        emailError: "A user has not been found with this email.",
      };
    } else if (errorMessage.includes("invalid-email")) {
      return {
        ...defaultLoginError,
        emailError: "The email is invalid. Try again with a valid email.",
      };
    } else if (errorMessage.includes("wrong-password")) {
      return {
        ...defaultLoginError,
        passwordError: "Wrong password.",
      };
    } else if (errorMessage.includes("internal-error")) {
      return {
        ...defaultLoginError,
        unknownError:
          "Internal error. Make sure you have typed a valid password.",
      };
    } else {
      return {
        ...defaultLoginError,
        unknownError: errorMessage,
      };
    }
  };
  
  export { signUpErrorHandler, logInErrorHandler };