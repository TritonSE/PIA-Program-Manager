import Image from "next/image";

import { cn } from "../lib/utils";

type FrameProps = {
  className?: string;
  isMobile?: boolean;
};

type ContactFrameProps = {
  email: string;
} & FrameProps;

type PasswordFrameProps = {
  passwordLength: number;
} & FrameProps;

type BasicInfoFrameProps = {
  name: string;
} & FrameProps;

const frameFormat =
  "border-pia_neutral_gray flex w-full flex-grow-0 flex-col place-content-stretch overflow-hidden rounded-lg border-[2px] bg-white";

export function ContactFrame({ className, email }: ContactFrameProps) {
  return (
    <div className={cn(frameFormat, className)}>
      {/*Info header*/}
      <div className="font-Poppins ml-3 flex pt-6 text-base sm:ml-8 sm:pt-8 sm:text-2xl">
        Contact Info
      </div>
      {/*Info Fields */}
      <div className="font-Poppins flex-grow py-4 text-xs hover:bg-pia_accent_green sm:text-base">
        <div className="ml-3 flex h-full w-auto flex-row sm:ml-12">
          <div className="flex w-1/3 flex-none items-center sm:w-1/5">Email</div>
          <div className="flex flex-grow items-center">{email}</div>
          <Image
            src="caretright.svg"
            alt="caretright"
            className="mx-7 flex items-center sm:mx-11"
            height={12}
            width={7}
          />
        </div>
      </div>
    </div>
  );
}

export function PasswordFrame({ className, passwordLength }: PasswordFrameProps) {
  return (
    <div className={cn(frameFormat, className)}>
      {/*Info header*/}
      <div className="font-Poppins ml-3 flex pt-6 text-base sm:ml-8 sm:pt-8 sm:text-2xl">
        Password
      </div>
      {/*Info Fields */}
      <div className="font-Poppins flex-grow py-4 text-xs hover:bg-pia_accent_green sm:text-base">
        <div className="ml-3 flex h-full w-auto flex-row sm:ml-12">
          <div className="flex w-1/3 flex-none items-center sm:w-1/5">
            {"\u2022".repeat(passwordLength)}
          </div>
          <div className="flex flex-grow items-center">Last changed</div>
          <Image
            src="caretright.svg"
            alt="caretright"
            className="mx-7 flex items-center sm:mx-11"
            height={12}
            width={7}
          />
        </div>
      </div>
    </div>
  );
}

export function BasicInfoFrame({ className, name, isMobile }: BasicInfoFrameProps) {
  return (
    <div className={cn(frameFormat, className)}>
      {/*Info header*/}
      <div className="font-Poppins ml-3 flex pt-6 text-base sm:ml-8 sm:pt-8 sm:text-2xl">
        Basic Info
      </div>
      {/*Info Fields*/}
      <div className="font-Poppins h-auto w-full flex-grow">
        <div className="flex h-full flex-col divide-y-2">
          {/*Profile picture*/}
          <div className="font-Poppins text-xs hover:bg-pia_accent_green sm:text-base">
            <div className="ml-3 flex h-full w-auto flex-row sm:ml-12">
              <div className="flex w-1/3 flex-none items-center sm:w-1/5">Profile Picture</div>
              <div className="flex flex-grow items-center text-gray-400">
                {isMobile ? "Add a picture" : "Add a profile picture to personalize your account"}
              </div>
              <Image
                alt="Profile Picture"
                src="/sidebar/logo.png"
                className="m-2 flex items-center "
                width={isMobile ? 50 : 80}
                height={isMobile ? 50 : 80}
              />{" "}
            </div>
          </div>
          {/*Name*/}
          <div className="font-Poppins flex-grow py-4 text-xs hover:bg-pia_accent_green sm:text-base">
            <div className="ml-3 flex h-full w-auto flex-row sm:ml-12">
              <div className="flex w-1/3 flex-none items-center sm:w-1/5">Name</div>
              <div className="flex flex-grow items-center">{name}</div>
              <Image
                src="caretright.svg"
                alt="caretright"
                className="mx-7 flex items-center sm:mx-11"
                height={12}
                width={7}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
