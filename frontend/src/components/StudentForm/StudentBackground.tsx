import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Student } from "../../api/students";
import { cn } from "../../lib/utils";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import LoadingSpinner from "../LoadingSpinner";
import SaveCancelButtons from "../Modals/SaveCancelButtons";
import { Textfield } from "../Textfield";
import { Dialog, DialogContent } from "../ui/dialog";

import { StudentFormData } from "./types";

import { editPhoto, getPhoto } from "@/api/user";
import { UserContext } from "@/contexts/user";

type StudentBackgroundProps = {
  classname?: string;
  data: Student | null;
};

const conservationList = ["Yes", "No"];

export const convertDateToString = (date: Date | undefined) => {
  return date
    ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";
};

export default function StudentBackground({ data, classname }: StudentBackgroundProps) {
  const { register, setValue: setCalendarValue } = useFormContext<StudentFormData>();
  const [modalOpen, setModalOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File>();
  const [previousImage, setPreviousImage] = useState(data?.profilePicture);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [clickedAddProfile, setClickedAddProfile] = useState(false);
  const [imageError, setImageError] = useState("");

  const [_openSaveCancel, setOpenSaveCancel] = useState(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const { firebaseUser } = useContext(UserContext);
  const [firebaseToken, setFirebaseToken] = useState("");

  useEffect(() => {
    if (!firebaseUser || !data) return;
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then((token) => {
          setFirebaseToken(token);
          if (data?.profilePicture === "default") {
            setImagePreview("default");
            return;
          }
          getPhoto(data.profilePicture, data._id, "student", token).then(
            (result) => {
              if (result.success) {
                const newImage = result.data;
                setImagePreview(newImage);
                setPreviousImage(newImage);
              } else {
                console.error(result.error);
              }
            },
            (error) => {
              console.error(error);
            },
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);

  const onCancelImage = () => {
    setClickedAddProfile(false);
    if (imagePreview && imagePreview !== "default") URL.revokeObjectURL(imagePreview); //Prevent memory leaks
    setImagePreview(previousImage ?? "default");
    setImageError("");
  };

  const onSaveImage = () => {
    if (!imageFile) {
      setImageError("Please upload an image");
      return;
    }
    if (imageFile && data) {
      const formData = new FormData();
      formData.append("image", imageFile);
      editPhoto(formData, data.profilePicture, data._id, "student", firebaseToken)
        .then((result) => {
          if (result.success) {
            setModalOpen(false);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files?.[0]) {
      const newProfilePicture = URL.createObjectURL(e.target.files[0]);
      setPreviousImage(imagePreview);
      setImagePreview(newProfilePicture);
      setImageFile(e.target.files[0]);
    }
    setClickedAddProfile(true);
  };

  return (
    <div className={cn("grid flex-1 gap-x-8 gap-y-10 md:grid-cols-2", classname)}>
      <div>
        <h3 className="mb-5 block">Address</h3>
        <Textfield
          register={register}
          name="address"
          placeholder="123 Maple St"
          defaultValue={data?.location}
        />
      </div>
      <div>
        <h3 className="mb-5">Birthdate</h3>
        <Textfield
          register={register}
          name="birthdate"
          placeholder="00/00/0000"
          calendar={true}
          setCalendarValue={setCalendarValue}
          defaultValue={convertDateToString(data?.birthday)}
        />
      </div>
      <div className="col-span-2">
        <h3 className="mb-5 w-full text-left text-lg font-bold">Conserved</h3>
        <Checkbox
          register={register}
          name="conservation"
          options={conservationList}
          defaultValue={[data?.conservation ? "Yes" : "No"]}
          className="grid-cols-2"
        />
      </div>
      <div className="col-span-2">
        <h3 className="mb-5 w-full text-left text-lg font-bold">Medication and Medical</h3>
        <Textfield
          register={register}
          name="medication"
          placeholder="Specify"
          defaultValue={data?.medication}
        />
      </div>
      <div className="col-span-2">
        <span className="align-center flex w-full justify-between">
          <h3 className="mb-5 text-left text-lg font-bold">Profile Picture</h3>
          <button
            className="flex w-fit cursor-pointer gap-2"
            onClick={(e) => {
              e.preventDefault();
              setModalOpen(true);
            }}
          >
            <label htmlFor="image_upload" className="grid cursor-pointer">
              <div className="flex gap-3">
                <span>
                  <Image src="/pencil.svg" alt="Pencil icon" aria-hidden width="20" height="20" />
                </span>
                Edit Image
              </div>
            </label>
          </button>
        </span>
        {imagePreview ? (
          <div className="aspect-square w-[85px]">
            <Image
              onClick={() => {
                setModalOpen(true);
              }}
              className="h-full w-full rounded-full object-cover"
              src={imagePreview !== "default" ? imagePreview : "/defaultProfilePic.svg"}
              alt="Profile Picture"
              height="85"
              width="85"
            />
          </div>
        ) : (
          <LoadingSpinner
            classname="h-auto w-auto flex"
            label="Loading Image..."
            spinnerSize={50}
          />
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className={"max-h-[60%] max-w-[80%] rounded-[8px] md:max-w-[50%] lg:max-w-[25%]"}
        >
          <div className="grid gap-5 px-[40px] py-[30px]">
            <button
              className="ml-auto"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.70711 0.292894C1.31658 -0.0976312 0.683417 -0.0976312 0.292893 0.292894C-0.0976311 0.683418 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683418 9.70711 0.292894C9.31658 -0.0976301 8.68342 -0.0976301 8.29289 0.292894L5 3.58579L1.70711 0.292894Z"
                  fill="black"
                />
              </svg>
            </button>
            <h3 className="text-xl sm:text-2xl ">Edit Photo</h3>
            <div className="relative mx-auto aspect-square h-[190px] py-5">
              <Image
                alt="Profile Picture"
                src={imagePreview !== "default" ? imagePreview : "/defaultProfilePic.svg"}
                className={`rounded-full object-cover ${imagePreview ? "opacity-100" : "opacity-0"}`}
                fill
              />
            </div>
            <p
              className={`flex items-center text-sm text-red-500 ${imageError ? "opacity-100" : "opacity-0"}`}
            >
              <span>
                <AlertCircle className="mr-1 w-[1.5em]" aria-hidden="true" />
              </span>
              {imageError}
            </p>
            {clickedAddProfile ? (
              <SaveCancelButtons
                setOpen={setOpenSaveCancel}
                onCancelClick={onCancelImage}
                onSaveClick={onSaveImage}
              />
            ) : (
              // <button onClick={() => fileUploadRef.current?.click()}>Add Photo</button>
              <div className="grid w-full">
                <Button onClick={() => fileUploadRef.current?.click()} label="Add Photo" />
                <input
                  onChange={handleImageUpload}
                  ref={fileUploadRef}
                  className="hidden"
                  id="image_upload"
                  type="file"
                  accept=".png, .jpg, .jpeg, .webp"
                ></input>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
