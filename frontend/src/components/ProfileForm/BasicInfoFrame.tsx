import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { cn } from "../../lib/utils";
import { FrameProps } from "../../pages/profile";
import { Button } from "../Button";
import SaveCancelButtons from "../SaveCancelButtons";
import { Textfield } from "../Textfield";
import { Dialog, DialogTrigger } from "../ui/dialog";

import ProfileDialogContent from "./ProfileDialogContent";

type ProfileBasicData = {
  name: string;
  image: string;
};

type BasicInfoFrameProps = {
  name: string;
  data: ProfileBasicData;
  setData: React.Dispatch<React.SetStateAction<ProfileBasicData>>;
} & FrameProps;

type ProfileBasicInfoFormData = {
  name: string;
};

export function BasicInfoFrame({
  className,
  name,
  isMobile,
  frameFormat,
  data,
  setData,
}: BasicInfoFrameProps) {
  const [openProfileForm, setOpenProfileForm] = useState(false);
  const [openNameForm, setOpenNameForm] = useState(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<string>();
  const [clickedAddProfile, setClickedAddProfile] = useState(false);
  const { register, handleSubmit } = useForm<ProfileBasicInfoFormData>();

  const oldImage = data.image;

  const onCancelClick = () => {
    setClickedAddProfile(false);
    setImageFile(oldImage);
  };

  const onSubmit = (formData: ProfileBasicInfoFormData) => {
    if (formData.name === data.name) return;
    setData({ name: formData.name, image: "" });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files?.[0]) {
      setImageFile(URL.createObjectURL(e.target.files[0]));
    }
    setClickedAddProfile(true);
  };

  //Prevent memory leaks
  useEffect(() => {
    return () => {
      if (imageFile) {
        URL.revokeObjectURL(imageFile);
      }
    };
  }, [imageFile]);

  return (
    <section className={cn(frameFormat, className)}>
      {/*Info header*/}
      <div className=" ml-3 flex pb-2 pt-6 text-base sm:ml-10 sm:pt-8 sm:text-2xl">Basic Info</div>
      {/*Info Fields*/}
      <div className=" h-auto w-full flex-grow">
        <div className="flex h-full flex-col divide-y-2">
          {/*Profile picture*/}
          <Dialog open={openProfileForm} onOpenChange={setOpenProfileForm}>
            <DialogTrigger asChild>
              <div
                className="cursor-pointer text-xs hover:bg-pia_accent_green sm:text-base"
                onClick={() => {
                  setOpenProfileForm(true);
                }}
              >
                <div className="ml-3 flex h-full w-auto flex-row pr-5 sm:ml-14">
                  <div className="flex w-1/3 flex-none items-center sm:w-1/5">Profile Picture</div>
                  <div className="flex flex-grow items-center text-[#6C6C6C]">
                    {isMobile
                      ? "Add a picture"
                      : "Add a profile picture to personalize your account"}
                  </div>
                  <Image
                    alt="Profile Picture"
                    src={imageFile ? imageFile : "/sidebar/logo.png"}
                    className="m-2 flex items-center rounded-full"
                    width={isMobile ? 50 : 80}
                    height={isMobile ? 50 : 80}
                  />
                </div>
              </div>
            </DialogTrigger>
            <ProfileDialogContent
              title="Profile Picture"
              description="A profile picture helps people in PIA recognize you."
            >
              <>
                <div className="relative h-80  ">
                  <Image
                    alt="Profile Picture"
                    src={imageFile ? imageFile : "/sidebar/logo.png"}
                    className="object-contain"
                    fill={true}
                  />
                </div>
                {clickedAddProfile ? (
                  <SaveCancelButtons setOpen={setOpenProfileForm} onCancelClick={onCancelClick} />
                ) : (
                  <label htmlFor="image_upload" className="grid">
                    <Button
                      onClick={() => {
                        fileUploadRef.current?.click();
                      }}
                      label="Add a profile picture"
                    />
                    <input
                      onChange={handleImageUpload}
                      ref={fileUploadRef}
                      className="hidden"
                      id="image_upload"
                      type="file"
                      accept=".png, .jpg, .jpeg, .webp"
                    ></input>
                  </label>
                )}
              </>
            </ProfileDialogContent>
          </Dialog>
          {/*Name*/}
          <Dialog open={openNameForm} onOpenChange={setOpenNameForm}>
            <DialogTrigger asChild>
              <div
                className=" flex-grow cursor-pointer py-6 text-xs transition-colors hover:bg-pia_accent_green sm:text-base"
                onClick={() => {
                  setOpenNameForm(true);
                }}
              >
                <div className="ml-3 flex h-full w-auto flex-row pr-5 sm:ml-14">
                  <div className="flex w-1/3 flex-none items-center sm:w-1/5">Name</div>
                  <div className="flex flex-grow items-center">{data.name}</div>
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
              title="Name"
              description="Your first and last name to confirm your identity. "
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Textfield
                  name="name"
                  placeholder="Full name"
                  register={register}
                  defaultValue={name}
                />
                <SaveCancelButtons setOpen={setOpenNameForm} />
              </form>
            </ProfileDialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
