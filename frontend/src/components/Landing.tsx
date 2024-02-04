/**
 * Navigation Component
 *
 * Wraps the content of the current page with the navbar
 * Uses the constant in `src/constants` to populate the actual sidebar
 */
import { Poppins } from "next/font/google";
import Image from "next/image";
import React, { useMemo } from "react";

import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

// the logo and company name component
const Logo = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-14 flex flex-col items-center">
        <h1 className="font-[alternate-gothic] text-6xl text-white max-lg:text-5xl">Welcome to</h1>
        <h1 className="font-[alternate-gothic] text-6xl text-white max-lg:text-5xl">
        Plant it Again!
        </h1>
      </div>
      <div className="flex h-[50%] flex-col items-center">
        <Image alt="company logo" src="/sidebar/logo.png" width={250} height={250} className="" />
      </div>
    </div>
  );
};

// Navigation component that wraps the content of the page
function Landing({ children }: { children: React.ReactNode }) {
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width <= 640, [width]);

  return (
    <main
      className={cn(
        "flex h-full w-full bg-pia_primary_light_green max-sm:relative sm:max-lg:flex-col",
        poppins.className,
      )}
    >
      {/* Login left side */}
      {!isMobile ? (
        <div
          className={cn(
            "flex h-screen w-full bg-pia_primary_light_green max-sm:relative",
            poppins.className,
          )}
        >
          <div
            className={cn(
              "z-10 flex h-screen w-[50%] flex-col", // Adjust the width based on the isMobile flag
              "flex-col gap-12 bg-pia_dark_green pt-16 text-pia_accent_green transition-transform",
            )}
          >
            <Logo />
          </div>
          <div
            className={cn(
              "flex h-screen w-[50%] flex-col", // Adjust the width based on the isMobile flag
            )}
          >
            {children}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex h-screen w-full bg-pia_primary_light_green max-sm:relative",
            poppins.className,
          )}
        >
          {children}
        </div>
      )}
    </main>
  );
}

export default Landing;
