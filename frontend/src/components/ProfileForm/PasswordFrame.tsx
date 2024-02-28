import Image from "next/image";

import { cn } from "../../lib/utils";
import { FrameProps } from "../../pages/profile";

type PasswordFrameProps = {
  passwordLength: number;
} & FrameProps;

export function PasswordFrame({ className, passwordLength, frameFormat }: PasswordFrameProps) {
  return (
    <section className={cn(frameFormat, className)}>
      {/*Info header*/}
      <div className=" ml-3 flex pb-2 pt-6 text-base sm:ml-10 sm:pt-8 sm:text-2xl">Password</div>
      {/*Info Fields */}
      <div className=" flex-grow cursor-pointer py-6 text-xs hover:bg-pia_accent_green sm:text-base">
        <div className="ml-3 flex h-full w-auto flex-row pr-5 sm:ml-14 ">
          <div className="flex w-1/3 flex-none items-center sm:w-1/5 ">
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
    </section>
  );
}
