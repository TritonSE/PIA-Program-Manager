import { AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { checkEmailExists } from "../../../backend/src/util/firebase";

import { Textfield } from "@/components/Textfield";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function CreateUser() {
  console.log("In create_user.tsx");

  const { register, setValue, handleSubmit } = useForm();
  const _setValue = setValue;

  const [passwordError, setPasswordError] = useState(true);
  const [matchError, setMatchError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.name);
    switch (event.target.name) {
      case "name":
        setName(event.target.value); // Save user name
        console.log(name); // Use for linter
        break;
      case "email":
        setEmail(event.target.value); // Save user email
        console.log(email); // Use for linter
        break;
      case "password":
        console.log(event.target.value.length, passwordError);
        setPassword(event.target.value);
        setPasswordError(event.target.value.length < 6);
        setMatchError(event.target.value !== confirm);
        break;
      case "confirm":
        console.log(password, confirm, matchError);
        setConfirm(event.target.value);
        setMatchError(password !== event.target.value);
        break;
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setEmailError(false);

      console.log("Entered");

      // const emailExists = await checkEmailExists(data.email);
      const emailExists = await checkEmailExists(String(data.email));

      console.log("Checked Email");

      if (emailExists) {
        setEmailError(true);
        return;
      }
    } catch (error) {
      console.error("Error checking if email already in use: ", error);
    }

    // setName(data.name);   // Save user name
    // setEmail(data.email); // Save user email
    void router.push("/create_user_2");
  };
  // const onSubmit: SubmitHandler<FieldValues> = (data) => {
  //   setEmailError(false); // add email error logic here
  //   console.log(data);

  //   void router.push("/create_user_2");
  // };
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width <= 640, [width]);

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
                {emailError && (
                  <h1 className="mt-1 flex items-center text-sm font-light text-orange-700 text-pia_accent">
                    <AlertCircle className="mr-1 text-sm" /> Account already exists for this email.
                    Sign in?
                  </h1>
                )}
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
              <button type="submit" className="rounded-md bg-pia_dark_green px-5 py-3 text-white">
                Continue
              </button>
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
