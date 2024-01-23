/**
 * Navigation Component
 *
 * Wraps the content of the current page with the navbar
 * Uses the constant in `src/constants` to populate the actual sidebar
 */
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";

import { navigation } from "../constants/navigation";
import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

type LinkProps = {
  setShelf: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
};

// the logo and company name component
const Logo = ({ setShelf, isMobile, black }: LinkProps & { black?: boolean }) => {
  return (
    <Link
      href="/"
      onClick={() => {
        if (isMobile) setShelf(false);
      }}
      className="flex items-center gap-2 pl-8 pr-8 max-sm:w-fit max-sm:justify-normal sm:max-lg:p-0"
    >
      <Image
        alt="company logo"
        src="/sidebar/logo.png"
        width={36}
        height={36}
        className="max-sm:w-6"
      />
      <h1
        className="font-[alternate-gothic] text-2xl text-white max-lg:text-lg"
        style={black ? { color: "black" } : {}}
      >
        PLANT IT AGAIN
      </h1>
    </Link>
  );
};

// the mapping of elements within navigation
const Links = ({ setShelf, isMobile }: LinkProps) => {
  const router = useRouter();

  return navigation.map((item, i) => {
    return (
      <Link
        href={item.href}
        onClick={() => {
          if (isMobile) setShelf(false);
        }}
        className="relative flex h-10 items-center gap-4 fill-pia_accent_green pl-8 pr-8 max-sm:gap-2 sm:max-lg:p-0"
        key={i}
        style={router.pathname === item.href ? { fill: "white" } : {}}
      >
        <div className="h-4 w-4 sm:h-6 sm:w-6">{item.icon}</div>
        <div
          className="font-bold max-sm:text-sm sm:max-lg:hidden"
          style={router.pathname === item.href ? { color: "white" } : {}}
        >
          {item.title}
        </div>
      </Link>
    );
  });
};

// Navigation component that wraps the content of the page
function Navigation({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [offset, setOffset] = React.useState(0);
  const [shelf, setShelf] = React.useState(false); // on mobile whether the navbar is open
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width <= 640, [width]);

  useEffect(() => {
    const ordering = navigation.map((item) => item.href);
    const idx = ordering.indexOf(router.pathname) | 0;
    setOffset(idx * 68);
  }, [router.pathname]);

  return (
    <main
      className={cn(
        "flex h-screen w-full bg-pia_primary_light_green max-sm:relative sm:max-lg:flex-col",
        poppins.className,
      )}
    >
      {/* mobile top bar - is not visible in nonmobile viewports */}
      <div className="border-neutralGray absolute z-10 flex h-10 w-full items-center border-[1px] border-solid pl-4 sm:hidden">
        <Image
          src="/sidebar/nav_menu.svg"
          alt="nav burger"
          onClick={() => {
            setShelf(true);
          }}
          className="w-6 sm:hidden"
          width={24}
          height={24}
        />
        <div className="m-auto translate-x-[-20px]">
          <Logo setShelf={setShelf} isMobile={isMobile} black />
        </div>
      </div>

      {/* navbar */}
      <nav
        className={cn(
          "z-10 flex h-full w-[240px] flex-col gap-12 bg-pia_dark_green pt-16 text-pia_accent_green transition-transform",
          "max-sm:gap-8 max-sm:pt-5 sm:max-lg:h-10 sm:max-lg:w-full sm:max-lg:flex-row sm:max-lg:justify-between sm:max-lg:pl-12 sm:max-lg:pr-12 sm:max-lg:pt-0",
          shelf ? "" : "max-sm:-translate-x-full",
        )}
      >
        <Logo setShelf={setShelf} isMobile={isMobile} />
        <div className="relative flex flex-col gap-7 max-sm:gap-2 sm:max-lg:flex-row">
          <div
            className="absolute h-10 w-2 rounded-br-lg rounded-tr-lg bg-[white] max-lg:hidden"
            style={{ top: offset, transition: "0.2s all" }}
          ></div>
          <Links setShelf={setShelf} isMobile={isMobile} />
        </div>
      </nav>

      <div
        className="h-full w-full p-[24px] max-lg:absolute max-lg:pt-14 lg:w-[calc(100%-240px)]"
        onClick={(e) => {
          if (isMobile) {
            e.stopPropagation();
            setShelf(false);
          }
        }}
      >
        {children}
      </div>
    </main>
  );
}

export default Navigation;
