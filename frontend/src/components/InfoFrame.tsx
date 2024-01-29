import { cn } from "../lib/utils";

type ContactFrameProps = {
  className?: string;
  email: string;
};

type PasswordFrameProps = {
  className?: string;
  passwordLength: number;
};

export function ContactFrame({ className, email }: ContactFrameProps) {
  return (
    <div
      className={cn(
        "border-neutral_gray flex h-[130px] w-full flex-grow-0 flex-col place-content-stretch overflow-hidden rounded-md border-[1px] bg-white",
        className,
      )}
    >
      {/*Info header*/}
      <div className="font-Poppins ml-8 flex pt-8 text-2xl">Contact Info</div>
      {/*Info Fields */}
      <div className="font-Poppins text-m flex-grow hover:bg-pia_accent_green">
        <div className="mx-10 flex h-full flex-row gap-5">
          <div className="flex w-1/4 items-center">Email</div>
          <div className="flex flex-grow items-center">{email}</div>
          <div className="flex items-center">{">"}</div>
        </div>
      </div>
    </div>
  );
}

export function PasswordFrame({ className, passwordLength }: PasswordFrameProps) {
  return (
    <div
      className={cn(
        "border-neutral_gray flex h-[130px] w-full flex-grow-0 flex-col place-content-stretch overflow-hidden rounded-md border-[1px] bg-white ",
        className,
      )}
    >
      {/*Info header*/}
      <div className="font-Poppins ml-8 flex pt-8 text-2xl">Password</div>
      {/*Info Fields */}
      <div className="font-Poppins text-m flex-grow hover:bg-pia_accent_green">
        <div className="mx-10 flex h-full flex-row gap-5">
          <div className="flex w-1/4 items-center">{"\u2022".repeat(passwordLength)}</div>
          <div className="text-disabled flex flex-grow items-center">Last changed</div>
          <div className="flex items-center">{">"}</div>
        </div>
      </div>
    </div>
  );
}
