import React, { useContext, useEffect, useState } from "react";

import { getPhoto } from "../api/users";
import { BasicInfoFrame } from "../components/ProfileForm/BasicInfoFrame";
import { ContactFrame } from "../components/ProfileForm/ContactInfoFrame";
import { PasswordFrame } from "../components/ProfileForm/PasswordFrame";
import { useWindowSize } from "../hooks/useWindowSize";

import { UserContext } from "@/contexts/user";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export type FrameProps = {
  className?: string;
  isMobile?: boolean;
  frameFormat?: string;
};

export default function Profile() {
  useRedirectToLoginIfNotSignedIn();

  const { piaUser } = useContext(UserContext);
  const { isMobile } = useWindowSize();
  const [basicInfoData, setBasicInfoData] = useState({ name: "", image: "" });
  const [contactInfoData, setContactInfoData] = useState({ email: "" });
  const [passwordData, setPasswordData] = useState({ last_changed: null as Date | null });

  const frameFormat =
    "border-pia_neutral_gray flex w-full flex-grow-0 flex-col place-content-stretch overflow-hidden rounded-lg border-[2px] bg-white";

  useEffect(() => {
    if (!piaUser) return;
    if (piaUser.profilePicture === "default") {
      setBasicInfoData((prev) => ({ ...prev, image: "default" }));
    } else if (piaUser.profilePicture) {
      getPhoto(piaUser.profilePicture).then(
        (result) => {
          if (result.success) {
            const newImage = result.data;
            setBasicInfoData((prev) => ({ ...prev, image: newImage }));
          } else {
            console.error(result.error);
          }
        },
        (error) => {
          console.error(error);
        },
      );
    }
    if (piaUser.name) {
      setBasicInfoData((prev) => ({ ...prev, name: piaUser.name }));
    }
    if (piaUser.email) {
      setContactInfoData((prev) => ({ ...prev, email: piaUser.email }));
    }
    if (piaUser.lastChangedPassword) {
      setPasswordData((prev) => ({ ...prev, last_changed: piaUser.lastChangedPassword }));
    }
  }, [piaUser]);

  if (!piaUser) return <h1>Loading...</h1>;

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
            isMobile={isMobile}
            frameFormat={frameFormat}
            data={basicInfoData}
            setData={setBasicInfoData}
            previousImageId={piaUser.profilePicture}
            userId={piaUser.uid}
          />
          <ContactFrame
            className=""
            isMobile={isMobile}
            frameFormat={frameFormat}
            data={contactInfoData}
            setData={setContactInfoData}
            userId={piaUser.uid}
          />
          <PasswordFrame
            className="mb-32"
            passwordLength={10}
            isMobile={isMobile}
            frameFormat={frameFormat}
            data={passwordData}
            setData={setPasswordData}
            userId={piaUser.uid}
          />
        </div>
      </div>
    </main>
  );
}
