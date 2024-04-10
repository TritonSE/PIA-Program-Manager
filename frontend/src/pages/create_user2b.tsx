import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";

import Landing from "@/components/Landing";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function CreateUser2b() {
  const router = useRouter();

  const onBack: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
    void router.push("/create_user");
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
          <div className="mt-10 flex flex-col">
            <button onClick={onBack} className="mb-5 flex rounded-md">
              <ArrowLeft className="text-1xl max-lg:text-1xl mr-2 text-pia_accent text-pia_dark_green" />{" "}
              <h1 className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                Back
              </h1>
            </button>
            <div className="flex h-full">
              <div className="mb-5 mt-5 flex flex-col">
                <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
                  This email is already in use.
                </h1>
                <h1 className="text-lg text-black max-lg:text-lg mt-4">
                  Forgot your password? If you are having trouble logging in,{" "}
                  <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
                    click here to reset your password
                  </a>
                  .
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

CreateUser2b.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};
