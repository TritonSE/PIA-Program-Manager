import { signOut } from "firebase/auth";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { cn } from "../../lib/utils";
import { FrameProps } from "../../pages/profile";
import SaveCancelButtons from "../SaveCancelButtons";
import { Textfield } from "../Textfield";
import { Dialog, DialogTrigger } from "../ui/dialog";

import ProfileDialogContent from "./ProfileDialogContent";

import { editEmail } from "@/api/user";
import { initFirebase } from "@/firebase/firebase";

type ContactFrameProps = {
  data: ProfileContactInfoFormData;
  setData: React.Dispatch<React.SetStateAction<ProfileContactInfoFormData>>;
  firebaseToken: string;
} & FrameProps;

type ProfileContactInfoFormData = {
  email: string;
};

export function ContactFrame({
  className,
  frameFormat,
  data,
  setData,
  firebaseToken,
}: ContactFrameProps) {
  const [openEmailForm, setOpenEmailForm] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { register, reset: _reset, handleSubmit } = useForm<ProfileContactInfoFormData>();
  const { auth } = initFirebase();
  const router = useRouter();

  const onSubmit = (formData: ProfileContactInfoFormData) => {
    if (formData.email === data.email) {
      setEmailError("Email is the same as the current one");
      return;
    }
    editEmail(formData.email, firebaseToken).then(
      (result) => {
        if (result.success) {
          console.log("Successfully updated email to ", result.data);
          setData({ email: formData.email });
          // Sign out user after email changes successfully
          signOut(auth)
            .then(() => {
              router.push("/login");
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          setEmailError(result.error);
        }
      },
      (error) => {
        console.error(error);
      },
    );
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
                src="../caretright.svg"
                alt="caretright"
                className="mx-7 flex w-[7px] items-center sm:mx-11"
                height={0}
                width={0}
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
              placeholder="Email"
              register={register}
              defaultValue={data.email}
            />
            {emailError ? (
              <p className="flex items-center pt-3 text-sm text-red-500">
                <span>
                  <AlertCircle className="mr-1 w-[1.5em]" aria-hidden="true" />
                </span>
                {emailError}
              </p>
            ) : (
              ""
            )}
            <SaveCancelButtons setOpen={setOpenEmailForm} />
          </form>
        </ProfileDialogContent>
      </Dialog>
    </section>
  );
}
