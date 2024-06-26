import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { MouseEvent, ReactElement, useEffect, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";

import { POST, handleAPIError } from "../api/requests";
// import { auth } from "../firebase/firebase";

import { Button } from "@/components/Button";
import Landing from "@/components/Landing";
import { useRedirectToHomeIfSignedIn } from "@/hooks/redirect";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function CreateUser() {
  useRedirectToHomeIfSignedIn();

  const router = useRouter();

  const { query } = router;
  console.log("Query:", query);

  const [isAdmin, setIsAdmin] = useState(true);
  // const [loading, setLoading] = useState(false);
  // const [createSuccess, setCreateSuccess] = useState(true);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);

    let isSuccess = true;

    try {
      // setLoading(true);

      const accountType = isAdmin ? "admin" : "team";

      console.log("Name:", query.name);
      console.log("Account Type:", accountType);
      console.log("Email:", query.email);
      console.log("Password:", query.password);

      // Set NEXT_PUBLIC_API_BASE_URL to http://localhost:4000/api in env file,
      // since otherwise was attempting to POST to http://localhost:3000/api/user/create
      const response = await POST(`/user/create`, {
        name: query.name,
        accountType,
        email: query.email,
        password: query.password,
      });

      // const response = await fetch('http://localhost:4000/api/user/create', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name: query.name,
      //     accountType,
      //     email: query.email,
      //     password: query.password,
      //   }),
      // });

      console.log("User created successfully:", response);
    } catch (error) {
      // setCreateSuccess(false);
      isSuccess = false;
      console.error("Error creating user:", error);
      handleAPIError(error);
    } finally {
      // setLoading(false);

      void router.push({
        pathname: "/create_user_3",
        query: {
          createSuccess: isSuccess,
        },
      });
    }

    // console.log(createSuccess);
    // console.log(loading);

    // void router.push({
    //   pathname: "/create_user_3",
    //   query: {
    //     createSuccess,
    //   },
    // });
  };

  const onBack: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
    void router.push("/create_user");
  };
  const { isMobile } = useWindowSize();

  useEffect(() => {
    console.log("isAdmin changed:", isAdmin);
  }, [isAdmin]);

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    switch (event.currentTarget.name) {
      case "admin":
        setIsAdmin(true);
        break;
      case "team":
        setIsAdmin(false);
        break;
    }
  }

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
            <div className="flex flex-col pt-10">
              <button onClick={onBack} className="flex rounded-md">
                <ArrowLeft className="text-1xl max-lg:text-1xl mr-2 text-pia_accent text-pia_dark_green" />{" "}
                <h1 className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                  Back
                </h1>
              </button>
              <div className="flex h-full">
                <div className="mb-5 mt-5 flex flex-col items-center">
                  <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">
                    Choose Account Type
                  </h1>
                </div>
              </div>
            </div>
          )}
          {!isMobile && (
            <div className="mb-10">
              <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-5xl">
                Choose Account Type
              </h1>
            </div>
          )}

          <div className="grid gap-5">
            <div className="flex w-full flex-col justify-between gap-10">
              <Button
                size="big"
                kind="secondary"
                label={
                  <div className="flex items-center">
                    {/* Image on the left */}
                    <div className="flex items-center">
                      <Image alt="admin" src="/admin.png" width={60} height={60} className="ml-5" />
                    </div>

                    {/* Submit text centered */}
                    <div className="flex w-full items-center justify-center">
                      <h1 className="text-2xl font-extrabold">Admin</h1>
                    </div>
                  </div>
                }
                type="button"
                name="admin"
                onClick={handleClick}
                selected={isAdmin}
              ></Button>
              <Button
                size="big"
                kind="secondary"
                label={
                  <div className="flex items-center">
                    {/* Image on the left */}
                    <div className="flex items-center">
                      <Image alt="team" src="/team.png" width={80} height={80} className="ml-5" />
                    </div>

                    {/* Submit text centered */}
                    <div className="flex w-full items-center justify-center">
                      <h1 className="text-2xl font-extrabold">Team</h1>
                    </div>
                  </div>
                }
                onClick={handleClick}
                type="button"
                name="team"
                selected={!isAdmin}
              ></Button>
              <div className="flex items-center justify-center">
                {!isMobile && (
                  <button
                    onClick={onBack}
                    className="flex w-[33%] items-center rounded-md px-5 py-3"
                    type="button"
                  >
                    <ArrowLeft className="text-1xl max-lg:text-1xl mr-2 text-pia_accent text-pia_dark_green" />{" "}
                    <h1 className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                      Back
                    </h1>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onSubmit}
                  className="flex w-full items-center justify-center rounded-md bg-pia_dark_green px-5 py-3 text-white"
                >
                  Submit <ArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

CreateUser.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};
