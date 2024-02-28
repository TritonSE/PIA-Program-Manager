import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { cn } from "../../lib/utils";
import { FrameProps } from "../../pages/profile";
import SaveCancelButtons from "../SaveCancelButtons";
import { Textfield } from "../Textfield";
import { Dialog, DialogTrigger } from "../ui/dialog";

import ProfileDialogContent from "./ProfileDialogContent";

type ContactFrameProps = {
  email: string;
  data: ProfileContactInfoFormData;
  setData: React.Dispatch<React.SetStateAction<ProfileContactInfoFormData>>;
} & FrameProps;

type ProfileContactInfoFormData = {
  email: string;
};

export function ContactFrame({ className, frameFormat, data, setData }: ContactFrameProps) {
  const [openEmailForm, setOpenEmailForm] = useState(false);
  const { register, reset: _reset, handleSubmit } = useForm<ProfileContactInfoFormData>();

  const onSubmit = (formData: ProfileContactInfoFormData) => {
    if (formData.email === data.email) return;
    console.log(formData);
    console.log(formData.email);
    setData({ email: formData.email });
  };

  return (
    <section className={cn(frameFormat, className)}>
      {/*Info header*/}
      <div className=" ml-3 flex pb-2 pt-6 text-base sm:ml-10 sm:pt-8 sm:text-2xl">
        Contact Info
      </div>
      {/*Info Fields */}
      <Dialog open={openEmailForm} onOpenChange={setOpenEmailForm}>
        <DialogTrigger asChild>
          <div className=" flex-grow cursor-pointer py-6 text-xs hover:bg-pia_accent_green sm:text-base">
            <div className="ml-3 flex h-full w-auto flex-row pr-5 sm:ml-14">
              <div className="flex w-1/3 flex-none items-center sm:w-1/5">Email</div>
              <div className="flex flex-grow items-center">{data.email}</div>
              <Image
                src="caretright.svg"
                alt="caretright"
                className="mx-7 flex items-center sm:mx-11"
                height={12}
                width={7}
              />
            </div>
          </div>
        </DialogTrigger>
        <ProfileDialogContent
          title="Contact Info"
          description="The address where people in PIA can contact you."
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Textfield
              name="email"
              placeholder="Full name"
              register={register}
              defaultValue={data.email}
            />
            <SaveCancelButtons setOpen={setOpenEmailForm} />
          </form>
        </ProfileDialogContent>
      </Dialog>
    </section>
  );
}
