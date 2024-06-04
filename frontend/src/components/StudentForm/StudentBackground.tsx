import Image from "next/image";
import { useFormContext } from "react-hook-form";

import { Student } from "../../api/students";
import { cn } from "../../lib/utils";
import { Checkbox } from "../Checkbox";
import { Textfield } from "../Textfield";

import { StudentFormData } from "./types";

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

  return (
    <div className={cn("grid flex-1 gap-x-3 gap-y-5 md:grid-cols-2", classname)}>
      <div>
        <h3 className="block">Address</h3>
        <Textfield
          register={register}
          name="address"
          placeholder="123 Maple St"
          defaultValue={data?.location}
        />
      </div>
      <div>
        <h3>Birthdate</h3>
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
        <h3 className="mb-5 w-full text-left text-lg font-bold">Conservation</h3>
        <Checkbox
          register={register}
          name="conservation"
          options={conservationList}
          defaultValue={[data?.conservation ? "Yes" : "No"]}
          className="h-[50px] sm:grid-cols-2 min-[1150px]:grid-cols-3"
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
            className="flex w-fit gap-2"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement image upload
            }}
          >
            <Image src="../pencil.svg" alt="edit profile picture" width="20" height="20" />
            <span className="whitespace-nowrap leading-normal tracking-tight">Edit Image</span>
          </button>
        </span>
        <Image
          src={data?.profilePicture ?? "../defaultProfilePic.svg"}
          alt="Profile Picture"
          height="85"
          width="85"
        />
      </div>
    </div>
  );
}
