import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { cn } from "../../../../lib/utils";
import { Button } from "../../../Button";
import { Textfield } from "../../../Textfield";
import { Dialog, DialogTrigger } from "../../../ui/dialog";
import { FrameProps } from "../PersonalInfo";

import ProfileDialogContent from "./ProfileDialogContent";

import { editName, editPhoto } from "@/api/user";
import SaveCancelButtons from "@/components/Modals/SaveCancelButtons";

type ProfileBasicData = {
  name: string;
  image: string;
};

type BasicInfoFrameProps = {
  data: ProfileBasicData;
  setData: React.Dispatch<React.SetStateAction<ProfileBasicData>>;
  previousImageId: string;
  setCurrentImageId: React.Dispatch<React.SetStateAction<string>>;
  firebaseToken: string;
} & FrameProps;

type ProfileBasicInfoFormData = {
  name: string;
};

export function BasicInfoFrame({
  className,
  isMobile,
  frameFormat,
  data,
  setData,
  previousImageId,
  setCurrentImageId,
  firebaseToken,
}: BasicInfoFrameProps) {
  const [openProfileForm, setOpenProfileForm] = useState(false);
  const [openNameForm, setOpenNameForm] = useState(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File>();
  const [previousImage, setPreviousImage] = useState(data.image);
  const [clickedAddProfile, setClickedAddProfile] = useState(false);
  const { register, handleSubmit } = useForm<ProfileBasicInfoFormData>();
  const [imageError, setImageError] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (!openNameForm) {
      setNameError("");
    }
  }, [openNameForm]);

  const onCancelImage = () => {
    setClickedAddProfile(false);
    URL.revokeObjectURL(data.image); //Prevent memory leaks
    setData((prev) => ({ ...prev, image: previousImage }));
    setImageError("");
  };

  const onSaveImage = () => {
    if (!imageFile) {
      setImageError("Please upload an image");
      return;
    }
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      editPhoto(formData, previousImageId, firebaseToken)
        .then((result) => {
          if (result.success) {
            setCurrentImageId(result.data);
            setOpenProfileForm(false);
            // Wait for the dialog to close before resetting the state
            setTimeout(() => {
              setClickedAddProfile(false);
            }, 150);
            console.log("Successfully added photo");
          } else {
            console.log("Error has occured");
            setImageError(result.error);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const onSubmit = (formData: ProfileBasicInfoFormData) => {
    if (formData.name === data.name) {
      setNameError("Name is the same as before");
      return;
    }
    if (formData.name.length === 0) {
      setNameError("Name cannot be empty");
      return;
    }
    editName(formData.name, firebaseToken).then(
      (result) => {
        if (result.success) {
          setData((prev) => ({ ...prev, name: formData.name }));
          setOpenNameForm(false);
          setNameError("");
        } else {
          console.error(result.error);
          setNameError(result.error);
        }
      },
      (error) => {
        console.error(error);
      },
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files?.[0]) {
      const newImage = URL.createObjectURL(e.target.files[0]);
      setData((prev) => {
        setPreviousImage(prev.image);
        return { ...prev, image: newImage };
      });
      setImageFile(e.target.files[0]);
    }
    setClickedAddProfile(true);
  };

  return (
    <section className={cn(frameFormat, className)}>
      {/*Info header*/}
      <div className=" ml-3 flex pb-2 pt-6 text-base sm:ml-10 sm:pt-8 sm:text-xl lg:text-2xl">
        Basic Info
      </div>
      {/*Info Fields*/}
      <div className=" h-auto w-full flex-grow">
        <div className="flex h-full flex-col divide-y-2">
          {/*Profile picture*/}
          <Dialog open={openProfileForm} onOpenChange={setOpenProfileForm}>
            <DialogTrigger asChild>
              <div
                className="cursor-pointer text-xs hover:bg-[#e7f0f0] sm:text-base"
                onClick={() => {
                  setOpenProfileForm(true);
                }}
              >
                <div className="ml-3 flex h-full w-auto flex-row gap-3 py-5 pr-5 sm:ml-14">
                  <div className="flex w-1/3 flex-none items-center sm:w-1/5">Profile Picture</div>
                  <div className="flex flex-grow items-center text-[#6C6C6C]">
                    {isMobile
                      ? "Add a picture"
                      : "Add a profile picture to personalize your account"}
                  </div>
                  <div
                    className="relative aspect-square"
                    style={{ width: isMobile ? "50px" : "80px" }}
                  >
                    {data.image !== "" ? (
                      <Image
                        alt="Profile Picture"
                        src={data.image !== "default" ? data.image : "/defaultProfilePic.svg"}
                        className="flex items-center rounded-full object-cover"
                        fill={true}
                      />
                    ) : null}
                  </div>
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
                    src={data.image !== "default" ? data.image : "/defaultProfilePic.svg"}
                    className="object-contain"
                    fill={true}
                  />
                </div>
                {clickedAddProfile ? (
                  <>
                    {imageError ? (
                      <p className="flex items-center  text-sm text-red-500">
                        <span>
                          <AlertCircle className="mr-1 w-[1.5em]" aria-hidden="true" />
                        </span>
                        {imageError}
                      </p>
                    ) : (
                      ""
                    )}
                    <SaveCancelButtons
                      setOpen={setOpenProfileForm}
                      onCancelClick={onCancelImage}
                      onSaveClick={onSaveImage}
                    />
                  </>
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
                className=" flex-grow cursor-pointer py-6 text-xs transition-colors hover:bg-[#e7f0f0] sm:text-base"
                onClick={() => {
                  setOpenNameForm(true);
                }}
              >
                <div className="ml-3 flex h-full w-auto flex-row pr-5 sm:ml-14">
                  <div className="flex w-1/3 flex-none items-center sm:w-1/5">Name</div>
                  <div className="flex flex-grow items-center">{data.name}</div>
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
              title="Name"
              description="Your first and last name to confirm your identity. "
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Textfield
                  name="name"
                  placeholder="Full name"
                  register={register}
                  defaultValue={data.name}
                />
                {nameError ? (
                  <p className="flex items-center pt-3 text-sm text-red-500">
                    <span>
                      <AlertCircle className="mr-1 w-[1.5em]" aria-hidden="true" />
                    </span>
                    {nameError}
                  </p>
                ) : (
                  ""
                )}
                <SaveCancelButtons setOpen={setOpenNameForm} />
              </form>
            </ProfileDialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
