import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";

import Landing from "@/components/Landing";
import { useRedirectToHomeIfSignedIn } from "@/hooks/redirect";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function CreateUser() {
  useRedirectToHomeIfSignedIn();
  const router = useRouter();

  const { createSuccess } = router.query;
  console.log("createSuccess:", createSuccess);

  const onBack: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
    // void router.push("/create_user_2");
    void router.push("/create_user");
  };

  const isSuccess = createSuccess === "true";

  const { isMobile } = useWindowSize();

  return (
    <main className="flex h-screen w-full justify-center">
      <div className="flex h-[85%] w-full items-center justify-center">
        <div
          className={cn(
            "flex h-full flex-col",
            isMobile ? "mt-[20%] w-[80%]" : "mb-[8%] w-[65%] justify-center",
          )}
        >
          {isMobile && (
            <div className="mt-10 flex flex-col">
              <button onClick={onBack} className="mb-5 flex rounded-md">
                <ArrowLeft className="text-1xl max-lg:text-1xl mr-2 text-pia_accent text-pia_dark_green" />{" "}
                <h1 className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                  Back
                </h1>
              </button>
              <div className="flex h-full">
                <div className="mb-5 mt-5 flex flex-col">
                  {isSuccess ? (
                    <>
                      <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">
                        We have received
                      </h1>
                      <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">
                        your account creation!
                      </h1>
                    </>
                  ) : (
                    <>
                      <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
                        Account could not be created at this time.
                      </h1>
                      <h1 className="mt-4 text-lg text-black max-lg:text-lg">
                        Please try again later. If the issue persists,{" "}
                        <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                          Contact Us.
                        </a>
                      </h1>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {!isMobile && (
            <div>
              <button onClick={onBack} className="mb-5 flex rounded-md">
                <ArrowLeft className="text-1xl max-lg:text-1xl mr-2 text-pia_accent text-pia_dark_green" />{" "}
                <h1 className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                  Back
                </h1>
              </button>
              <div className="mb-10">
                {isSuccess ? (
                  <>
                    <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
                      We have received
                    </h1>
                    <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
                      your account creation!
                    </h1>
                  </>
                ) : (
                  <>
                    <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
                      Account could not be created at this time.
                    </h1>
                    <>
                      <h1 className="mt-4 text-lg text-black max-lg:text-lg">
                        Please try again later. If the issue persists,{" "}
                        <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                          Contact Us.
                        </a>
                      </h1>
                    </>
                  </>
                )}
              </div>
            </div>
          )}
          {isSuccess && (
            <>
              <h1 className="text-lg text-black max-lg:text-lg">You will be notified by email</h1>
              <h1 className="mb-10 text-lg text-black max-lg:text-lg">
                if your account is approved.
              </h1>
            </>
          )}

          {isSuccess && (
            <h1 className="text-1xl max-lg:text-1xl mb-6 text-black text-pia_accent max-sm:text-sm">
              Haven&lsquo;t received a response yet?{" "}
              <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                Contact Us.
              </a>
            </h1>
          )}
        </div>
      </div>
    </main>
  );
}

CreateUser.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};
