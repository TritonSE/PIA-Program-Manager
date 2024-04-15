import { AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

// import { checkEmailExists } from "../firebase/firebase";

import Landing from "@/components/Landing";
import { Textfield } from "@/components/Textfield";
import { useRedirectToHomeIfSignedIn } from "@/hooks/redirect";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function CreateUser() {
  // console.log("In create_user.tsx");
  useRedirectToHomeIfSignedIn();

  const { register, setValue, handleSubmit } = useForm();
  const _setValue = setValue;

  const [formValid, setFormValid] = useState(false);

  const [passwordError, setPasswordError] = useState(true);
  const [matchError, setMatchError] = useState(false);
  // const [emailError, setEmailError] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { name, value } = event.target;

    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        setPasswordError(value.length < 6);
        setMatchError(value !== confirm);
        break;
      case "confirm":
        setConfirm(value);
        setMatchError(password !== value);
        break;
    }

    // Check if all fields are filled and passwords match
    setFormValid(
      name !== "" &&
        email !== "" &&
        password !== "" &&
        confirm !== "" &&
        !passwordError &&
        !matchError,
    );
  };

  // Add useEffect hook to handle clicks outside of text fields
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('input[type="text"]')) {
        // If the click is outside of any text input fields
        setFormValid(
          name !== "" &&
            email !== "" &&
            password !== "" &&
            confirm !== "" &&
            password === confirm &&
            !passwordError &&
            !matchError,
        );
      }
    };

    // Add event listener to handle clicks outside of text fields
    document.body.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup: Remove event listener when component unmounts
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [name, email, password, confirm, passwordError, matchError]);

  // eslint-disable-next-line @typescript-eslint/require-await
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // try {
    //   setEmailError(false);

    //   // const emailExists = await checkEmailExists(data.email);
    //   const emailExists = await checkEmailExists(String(data.email));

    //   console.log("Checked Email");

    //   if (emailExists) {
    //     setEmailError(true);
    //     return;
    //   }
    // } catch (error) {
    //   console.error("Error checking if email already in use: ", error);
    // }

    // void router.push("/create_user_2");
    void router.push({
      pathname: "/create_user_2",
      query: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  };

  // const { width } = useWindowSize();
  // const isMobile = useMemo(() => width <= 640, [width]);
  const { isMobile } = useWindowSize();

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <div className="flex h-full w-full items-center justify-center">
        <div
          className={cn(
            "flex h-full flex-col",
            isMobile ? "mt-[20%] w-[80%]" : "mb-[8%] w-[65%] justify-center",
          )}
        >
          {isMobile && (
            <div className="flex flex-col justify-center">
              <div className="flex h-full flex-col justify-center">
                <div className="flex flex-col items-center">
                  <Image
                    alt="company logo"
                    src="/sidebar/logo.png"
                    width={130}
                    height={130}
                    className=""
                  />
                </div>
                <div className="mb-5 mt-5 flex flex-col items-center">
                  <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">Welcome to</h1>
                  <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">
                    Plant it Again!
                  </h1>
                </div>
              </div>
            </div>
          )}
          {!isMobile && (
            <div>
              <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-5xl">
                Create an Account
              </h1>
              <h1 className="text-1xl max-lg:text-1xl mb-6 text-black text-pia_accent">
                Already have an account?{" "}
                <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                  Sign in
                </a>
              </h1>
            </div>
          )}

          <div className="grid gap-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col justify-between gap-5"
            >
              <div>
                <h1 className="text-lg font-light text-black text-pia_accent max-lg:text-lg">
                  Full Name
                </h1>
                <Textfield
                  register={register}
                  handleInputChange={onChange}
                  name={"name"}
                  label={""}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <h1 className="text-lg font-light text-black text-pia_accent max-lg:text-lg">
                  Email Address
                </h1>
                <Textfield
                  register={register}
                  handleInputChange={onChange}
                  name={"email"}
                  label={""}
                  placeholder="name@email.com"
                />
                {/* {emailError && (
                  <h1 className="mt-1 flex items-center text-sm font-light text-orange-700 text-pia_accent">
                    <AlertCircle className="mr-1 text-sm" /> Account already exists for this email.
                    Sign in?
                  </h1>
                )} */}
              </div>
              <div>
                <h1 className="text-lg font-light text-black text-pia_accent max-lg:text-lg">
                  Password
                </h1>
                <Textfield
                  register={register}
                  name={"password"}
                  handleInputChange={onChange}
                  label={""}
                  type="password"
                  placeholder="Enter password"
                />
                {passwordError ? (
                  <h1 className="mt-1 flex items-center text-sm font-light text-orange-700">
                    <AlertCircle className="mr-1 text-sm" /> At least 6 characters
                  </h1>
                ) : (
                  <h1 className="mt-1 flex items-center text-sm font-light text-green-700">
                    <CheckCircle2 className="mr-1 text-sm" /> At least 6 characters
                  </h1>
                )}
              </div>
              <div>
                <h1 className="text-lg font-light text-pia_accent max-lg:text-lg">
                  Confirm Password
                </h1>
                <Textfield
                  register={register}
                  handleInputChange={onChange}
                  name={"confirm"}
                  label=""
                  type="password"
                  placeholder="Re-enter Password"
                />
                {matchError && (
                  <h1 className="mt-1 flex items-center text-sm font-light text-orange-700">
                    <AlertCircle className="mr-1 text-sm" /> Passwords do not match.
                  </h1>
                )}
              </div>
              {/* <button type="submit" className="rounded-md bg-pia_dark_green px-5 py-3 text-white">
                Continue
              </button> */}
              <button
                type="submit"
                className={`rounded-md bg-pia_dark_green px-5 py-3 text-white ${!formValid && "cursor-not-allowed opacity-50"}`}
                disabled={!formValid}
              >
                Continue
              </button>
              {/* <button type="submit" className={`rounded-md bg-pia_dark_green px-5 py-3 text-white ${!formValid && 'opacity-50 cursor-not-allowed'}`} disabled={!formValid}>
                Continue
              </button> */}
              {isMobile && (
                <div className="flex items-center justify-center">
                  <h1 className={cn("text-sm text-black text-pia_accent max-lg:text-sm")}>
                    Already have an account?{" "}
                    <a className="text-sm text-black text-pia_accent max-lg:text-sm">Sign in</a>
                  </h1>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

CreateUser.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};
