import React, { useEffect, useMemo, useState } from "react";

import { getPhoto } from "../api/users";
import { BasicInfoFrame } from "../components/ProfileForm/BasicInfoFrame";
import { ContactFrame } from "../components/ProfileForm/ContactInfoFrame";
import { PasswordFrame } from "../components/ProfileForm/PasswordFrame";
import { useWindowSize } from "../hooks/useWindowSize";

export type FrameProps = {
  className?: string;
  isMobile?: boolean;
  frameFormat?: string;
};

export default function Profile() {
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width <= 640, [width]);
  const [basicInfoData, setBasicInfoData] = useState({ name: "John Smith", image: "" });
  const [contactInfoData, setContactInfoData] = useState({ email: "johnsmith@gmail.com" });
  const [passwordData, setPasswordData] = useState({ last_changed: new Date("01/08/2024") });

  const frameFormat =
    "border-pia_neutral_gray flex w-full flex-grow-0 flex-col place-content-stretch overflow-hidden rounded-lg border-[2px] bg-white";

  // Example of fetching an image from the backend using hardcoded ID
  useEffect(() => {
    const exampleImageID = "66147af38932931bad1dde06";
    getPhoto(exampleImageID).then(
      (result) => {
        if (result.success) {
          const newImage = result.data;
          console.log(newImage);
          setBasicInfoData((prev) => ({ ...prev, image: newImage }));
        } else {
          console.error(result.error);
        }
      },
      (error) => {
        console.error(error);
      },
    );
  }, []);

  return (
    <main>
      <div className={"mx-1 pt-2 sm:ml-6 sm:mr-16 sm:pt-10"}>
        {/* Title */}
        <h1 className={"font-[alternate-gothic] text-4xl uppercase"}>Personal Info</h1>

        <div className={isMobile ? "pt-4 text-xs" : "text-m pt-10"}>
          Personal info and options to manage it. You can change or update your info at anytime.
        </div>

        <div className="flex flex-col gap-6 pt-4">
          <BasicInfoFrame
            className=""
            name="John Smith"
            isMobile={isMobile}
            frameFormat={frameFormat}
            data={basicInfoData}
            setData={setBasicInfoData}
          />
          <ContactFrame
            className=""
            email="JohnSmith@gmail.com"
            isMobile={isMobile}
            frameFormat={frameFormat}
            data={contactInfoData}
            setData={setContactInfoData}
          />
          <PasswordFrame
            className=""
            passwordLength={10}
            isMobile={isMobile}
            frameFormat={frameFormat}
            data={passwordData}
            setData={setPasswordData}
          />
        </div>
      </div>
    </main>
  );
}
