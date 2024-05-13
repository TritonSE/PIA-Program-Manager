import React, { useContext, useEffect, useState } from "react";

import { getPhoto } from "../api/user";
import { BasicInfoFrame } from "../components/ProfileForm/BasicInfoFrame";
import { ContactFrame } from "../components/ProfileForm/ContactInfoFrame";
import { PasswordFrame } from "../components/ProfileForm/PasswordFrame";
import { useWindowSize } from "../hooks/useWindowSize";

import LoadingSpinner from "@/components/LoadingSpinner";
import { UserContext } from "@/contexts/user";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export type FrameProps = {
  className?: string;
  isMobile?: boolean;
  frameFormat?: string;
};

export default function Profile() {
  useRedirectToLoginIfNotSignedIn();

  const { piaUser, firebaseUser } = useContext(UserContext);
  const { isMobile } = useWindowSize();
  const [basicInfoData, setBasicInfoData] = useState({ name: "", image: "" });
  const [contactInfoData, setContactInfoData] = useState({ email: "" });
  const [passwordData, setPasswordData] = useState({ last_changed: null as Date | null });
  const [firebaseToken, setFirebaseToken] = useState("");
  const [currentImageId, setCurrentImageId] = useState("default");

  const frameFormat =
    "border-pia_neutral_gray flex w-full flex-grow-0 flex-col place-content-stretch overflow-hidden rounded-lg border-[2px] bg-white";

  useEffect(() => {
    if (!piaUser || !firebaseUser) return;

    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then((token) => {
          setFirebaseToken(token);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (piaUser.profilePicture === "default") {
      setBasicInfoData((prev) => ({ ...prev, image: "default" }));
    } else if (piaUser.profilePicture && firebaseToken) {
      setCurrentImageId(piaUser.profilePicture);
      getPhoto(piaUser.profilePicture, firebaseToken).then(
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
  }, [piaUser, firebaseUser, firebaseToken]);

  return (
    <div>
      <h1 className={"font-[alternate-gothic] text-2xl lg:text-4xl"}>Personal Info</h1>
      <div className="sm:text-m pt-4 text-sm sm:pt-10">
        Personal info and options to manage it. You can change or update your info at anytime.
      </div>
      {!piaUser || !firebaseUser ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col gap-6 pt-4">
          <BasicInfoFrame
            className=""
            isMobile={isMobile}
            frameFormat={frameFormat}
            data={basicInfoData}
            setData={setBasicInfoData}
            previousImageId={currentImageId}
            setCurrentImageId={setCurrentImageId}
            firebaseToken={firebaseToken}
          />
          <ContactFrame
            className=""
            isMobile={isMobile}
            frameFormat={frameFormat}
            data={contactInfoData}
            setData={setContactInfoData}
            firebaseToken={firebaseToken}
          />
          <PasswordFrame
            className="mb-32"
            passwordLength={10}
            isMobile={isMobile}
            frameFormat={frameFormat}
            data={passwordData}
            setData={setPasswordData}
            firebaseToken={firebaseToken}
          />
        </div>
      )}
    </div>
  );
}
