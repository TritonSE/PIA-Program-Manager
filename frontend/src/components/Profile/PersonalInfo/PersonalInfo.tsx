import React from "react";

import { BasicInfoFrame } from "./Forms/BasicInfoFrame";
import { ContactFrame } from "./Forms/ContactInfoFrame";
import { PasswordFrame } from "./Forms/PasswordFrame";

import { useFetchPersonalInfo } from "@/components/Profile/PersonalInfo/hooks/useFetchPersonalInfo";
import { useWindowSize } from "@/hooks/useWindowSize";
import { UserData } from "@/pages/profile";

export type FrameProps = {
  className?: string;
  isMobile?: boolean;
  frameFormat?: string;
};

const frameFormat =
  "border-pia_neutral_gray flex w-full flex-grow-0 flex-col place-content-stretch overflow-hidden rounded-lg border-[2px] bg-white";

type PersonalInfoProps = {
  userData: UserData;
};

export default function PersonalInfo({ userData }: PersonalInfoProps) {
  const { isMobile } = useWindowSize();
  const {
    loading,
    basicInfoData,
    setBasicInfoData,
    contactInfoData,
    setContactInfoData,
    passwordData,
    setPasswordData,
    firebaseToken,
    currentImageId,
    setCurrentImageId,
  } = useFetchPersonalInfo(userData);

  return (
    <section>
      <h2 className="font-[alternate-gothic] text-4xl">Personal Info</h2>
      <div className="sm:text-m pt-4 text-sm sm:pt-10">
        Personal info and options to manage it. You can change or update your info at anytime.
      </div>

      {loading ? (
        <div>Loading...</div>
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
    </section>
  );
}
