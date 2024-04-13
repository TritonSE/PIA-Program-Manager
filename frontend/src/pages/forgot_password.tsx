import { sendPasswordResetEmail } from "firebase/auth";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Landing from "@/components/Landing";
import { Textfield } from "@/components/Textfield";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/firebase";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function ForgotPassword() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const _setValue = setValue;

  const [firebaseError, setFirebaseError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    sendPasswordResetEmail(auth, data.email as string)
      .then(() => {
        setResetSent(true);
      })
      .catch((error: string) => {
        setFirebaseError(error);
      });
  };
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
                  <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">
                    Forgot Password?
                  </h1>
                </div>
              </div>
            </div>
          )}
          {!isMobile && (
            <div>
              <h1 className="mb-7 font-[alternate-gothic] text-5xl text-black max-lg:text-5xl">
                Forgot Password?
              </h1>
            </div>
          )}

          <div className="grid gap-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col justify-between gap-8"
            >
              <div>
                <h1 className="text-lg font-light text-black text-pia_accent max-lg:text-lg">
                  Email Address
                </h1>
                <Textfield
                  register={register}
                  name={"email"}
                  label={""}
                  type="email"
                  placeholder="name@email.com"
                  registerOptions={{ required: "Email cannot be empty" }}
                />
                {errors.email && (
                  <h1 className="mt-1 flex items-center text-sm font-light text-orange-700">
                    <AlertCircle className="mr-1 text-sm" />{" "}
                    {typeof errors.email.message === "string" ? errors.email.message : null}
                  </h1>
                )}
              </div>
              <Button
                type="submit"
                className="rounded-md bg-pia_dark_green px-5 py-3 text-white"
                disabled={resetSent}
              >
                Submit
              </Button>
              {resetSent && (
                <h1 className="mt-1 flex items-center text-sm font-light text-green-700">
                  <CheckCircle2 className="mr-1 text-sm" /> A reset password has been sent to your
                  email.
                  <Link
                    href="/login"
                    className="text-1xl max-lg:text-1xl ml-1 text-pia_accent text-pia_dark_green underline"
                  >
                    Login?
                  </Link>
                </h1>
              )}
              {!resetSent && firebaseError && (
                <h1 className="mt-1 flex items-center text-sm font-light text-orange-700">
                  <AlertCircle className="mr-1 text-sm" /> {firebaseError}
                </h1>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

ForgotPassword.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};
