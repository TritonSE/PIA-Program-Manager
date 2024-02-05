import React, { useMemo } from "react";

import { BasicInfoFrame, ContactFrame, PasswordFrame } from "../components/InfoFrame";
import { useWindowSize } from "../hooks/useWindowSize";

export default function Profile() {
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width <= 640, [width]);

  return (
    <main>
      <div className={"mx-1 pt-2 sm:ml-6 sm:mr-16 sm:pt-10"}>
        {/* Title */}
        <h1 className={"font-[alternate-gothic] text-4xl "}>Personal Info</h1>

        <div className={isMobile ? "pt-4 text-xs" : "text-m pt-10"}>
          Personal info and options to manage it. You can change or update your info at anytime.
        </div>

        <div className="flex flex-col gap-6 pt-4">
          <BasicInfoFrame className="" name="John Smith" isMobile={isMobile} />
          <ContactFrame className="" email="JohnSmith@gmail.com" isMobile={isMobile} />
          <PasswordFrame className="" passwordLength={10} isMobile={isMobile} />
        </div>
      </div>
    </main>
  );
}
