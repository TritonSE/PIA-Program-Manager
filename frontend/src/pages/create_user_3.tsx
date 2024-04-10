import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";

import { CREATE_FAIL_EMAIL, CREATE_FAIL_OTHER, CREATE_SUCCESS } from "./create_user_2";

import Landing from "@/components/Landing";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function CreateUser() {
  const router = useRouter();

  // const { createResult } = router.query;
  // const createResult: number = parseInt(router.query.createResult as string) || CREATE_FAIL_OTHER;

  const { res } = router.query;
  let createResult: number;
  console.log("res: ", res);
  if (res && typeof res === "string") {
    createResult = parseInt(res);
    console.log("createResult: ", createResult);
  } else {
    createResult = CREATE_FAIL_OTHER;
    console.log("default createResult: ", createResult);
  }

  const onBack: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
    void router.push("/create_user_2");
  };

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
                  {createResult === CREATE_SUCCESS && (
                    <>
                      <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">
                        We have received
                      </h1>
                      <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">
                        your account creation!
                      </h1>
                    </>
                  )}
                  {createResult === CREATE_FAIL_EMAIL && (
                    <>
                      <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
                        Account using this email already exists.
                      </h1>
                      <h1 className="text-lg text-black max-lg:text-lg">
                        Forgot your password?{" "}
                        <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                          Contact Us.
                        </a>
                      </h1>
                    </>
                  )}
                  {createResult === CREATE_FAIL_OTHER && (
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
          {/* Additional rendering for non-mobile devices */}
          {!isMobile && (
            <div>
              <button onClick={onBack} className="mb-5 flex rounded-md">
                <ArrowLeft className="text-1xl max-lg:text-1xl mr-2 text-pia_accent text-pia_dark_green" />{" "}
                <h1 className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                  Back
                </h1>
              </button>
              <div className="mb-10">
                {createResult === CREATE_SUCCESS && (
                  <>
                    <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
                      We have received
                    </h1>
                    <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
                      your account creation!
                    </h1>
                  </>
                )}
                {createResult === CREATE_FAIL_EMAIL && (
                  <>
                    <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
                      Account using this email already exists.
                    </h1>
                    <h1 className="text-lg text-black max-lg:text-lg">
                      Forgot your password?{" "}
                      <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                        Contact Us.
                      </a>
                    </h1>
                  </>
                )}
                {createResult === CREATE_FAIL_OTHER && (
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
          )}
          {/* Additional rendering for success case */}
          {createResult === CREATE_SUCCESS && (
            <>
              <h1 className="text-lg text-black max-lg:text-lg">You will be notified by email</h1>
              <h1 className="mb-10 text-lg text-black max-lg:text-lg">
                if your account is approved.
              </h1>
            </>
          )}

          {/* Common rendering for both mobile and non-mobile */}
          {createResult === CREATE_SUCCESS && (
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

  // return (
  //   <main className="flex h-screen w-full justify-center">
  //     <div className="flex h-[85%] w-full items-center justify-center">
  //       <div
  //         className={cn(
  //           "flex h-full flex-col",
  //           isMobile ? "mt-[20%] w-[80%]" : "mb-[8%] w-[65%] justify-center",
  //         )}
  //       >
  //         {isMobile && (
  //           <div className="mt-10 flex flex-col">
  //             <button onClick={onBack} className="mb-5 flex rounded-md">
  //               <ArrowLeft className="text-1xl max-lg:text-1xl mr-2 text-pia_accent text-pia_dark_green" />{" "}
  //               <h1 className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
  //                 Back
  //               </h1>
  //             </button>
  //             <div className="flex h-full">
  //               <div className="mb-5 mt-5 flex flex-col">
  //                 {isSuccess ? (
  //                   <>
  //                     <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">
  //                       We have received
  //                     </h1>
  //                     <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">
  //                       your account creation!
  //                     </h1>
  //                   </>
  //                 ) : (
  //                   <>
  //                     <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
  //                       Account could not be created at this time.
  //                     </h1>
  //                     <h1 className="mt-4 text-lg text-black max-lg:text-lg">
  //                       Please try again later. If the issue persists,{" "}
  //                       <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
  //                         Contact Us.
  //                       </a>
  //                     </h1>
  //                   </>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         )}
  //         {!isMobile && (
  //           <div>
  //             <button onClick={onBack} className="mb-5 flex rounded-md">
  //               <ArrowLeft className="text-1xl max-lg:text-1xl mr-2 text-pia_accent text-pia_dark_green" />{" "}
  //               <h1 className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
  //                 Back
  //               </h1>
  //             </button>
  //             <div className="mb-10">
  //               {isSuccess ? (
  //                 <>
  //                   <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
  //                     We have received
  //                   </h1>
  //                   <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
  //                     your account creation!
  //                   </h1>
  //                 </>
  //               ) : (
  //                 <>
  //                   <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
  //                     Account could not be created at this time.
  //                   </h1>
  //                   <>
  //                     <h1 className="mt-4 text-lg text-black max-lg:text-lg">
  //                       Please try again later. If the issue persists,{" "}
  //                       <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
  //                         Contact Us.
  //                       </a>
  //                     </h1>
  //                   </>
  //                 </>
  //               )}
  //             </div>
  //           </div>
  //         )}
  //         {isSuccess && (
  //           <>
  //             <h1 className="text-lg text-black max-lg:text-lg">You will be notified by email</h1>
  //             <h1 className="mb-10 text-lg text-black max-lg:text-lg">
  //               if your account is approved.
  //             </h1>
  //           </>
  //         )}

  //         {isSuccess && (
  //           <h1 className="text-1xl max-lg:text-1xl mb-6 text-black text-pia_accent max-sm:text-sm">
  //             Haven&lsquo;t received a response yet?{" "}
  //             <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
  //               Contact Us.
  //             </a>
  //           </h1>
  //         )}
  //       </div>
  //     </div>
  //   </main>
  // );
}

CreateUser.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};
