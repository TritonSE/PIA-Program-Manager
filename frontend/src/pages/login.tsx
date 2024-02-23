import Image from "next/image";
import { useMemo } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Textfield } from "@/components/Textfield";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { register, setValue, handleSubmit } = useForm();
  const _setValue = setValue;

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width <= 640, [width]);
  const isTablet = useMemo(() => width <= 1300, [width]);
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
                Sign in to PIA
              </h1>
              <h1 className="text-1xl max-lg:text-1xl mb-6 text-black text-pia_accent">
                Don&lsquo;t have an account?{" "}
                <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                  Sign up
                </a>
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
                />
              </div>
              <div>
                <h1 className="text-lg font-light text-pia_accent max-lg:text-lg">Password</h1>
                <Textfield
                  register={register}
                  name={"date"}
                  label=""
                  placeholder="Enter Password"
                />
                <h1
                  className={cn(
                    "mt-1 text-lg font-light text-pia_accent",
                    isTablet ? "underline" : "text-right text-pia_dark_green",
                    isMobile ? "text-sm underline max-lg:text-sm" : "text-lg max-lg:text-lg",
                  )}
                >
                  Forgot Password?
                </h1>
              </div>
              <Button type="submit" className="rounded-md bg-pia_dark_green px-5 py-3 text-white">
                Sign In
              </Button>
              {isMobile && (
                <div className="flex items-center justify-center">
                  <h1 className={cn("text-sm text-black text-pia_accent max-lg:text-sm")}>
                    Don&lsquo;t have an account?{" "}
                    <a className="text-blue text-sm text-pia_accent max-lg:text-sm">Sign up</a>
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
