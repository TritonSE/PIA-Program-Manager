import { ReactElement } from "react";

import Landing from "@/components/Landing";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export default function CreateUser() {
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
              <div className="flex h-full">
                <div className="mb-5 mt-5 flex flex-col">
                  <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">
                    We have received
                  </h1>
                  <h1 className="font-[alternate-gothic] text-3xl max-lg:text-3xl">
                    your account creation!
                  </h1>
                </div>
              </div>
            </div>
          )}
          {!isMobile && (
            <div>
              <div className="mb-10">
                <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
                  We have received
                </h1>
                <h1 className="font-[alternate-gothic] text-5xl text-black max-lg:text-4xl">
                  your account creation!
                </h1>
              </div>
            </div>
          )}
          <h1 className="text-lg text-black max-lg:text-lg">You will be notified by email</h1>
          <h1 className="mb-10 text-lg text-black max-lg:text-lg">if your account is approved.</h1>
          <h1 className="text-1xl max-lg:text-1xl mb-6 text-black text-pia_accent max-sm:text-sm">
            Haven&lsquo;t received a response yet?{" "}
            <a className="text-1xl max-lg:text-1xl text-pia_accent text-pia_dark_green">
              Contact Us.
            </a>
          </h1>
        </div>
      </div>
    </main>
  );
}

CreateUser.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};
