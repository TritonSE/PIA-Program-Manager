import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { StudentJSON } from "../../api/students";
import { cn } from "../../lib/utils";
import { Checkbox } from "../Checkbox";
import { Textfield } from "../Textfield";

import { StudentFormData } from "./types";

type StudentBackgroundProps = {
  register: UseFormRegister<StudentFormData>;
  classname?: string;
  setCalendarValue: UseFormSetValue<StudentFormData>;
  data: StudentJSON | null;
};

const dietaryList = ["Nuts", "Eggs", "Seafood", "Pollen", "Dairy", "Other"];

export const convertDateToString = (date: Date | undefined) => {
  return date
    ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";
};

export default function StudentBackground({
  data,
  register,
  classname,
  setCalendarValue,
}: StudentBackgroundProps) {
  return (
    <div className="grid w-full gap-5 lg:grid-cols-2">
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
        <div>
          <h3>Mediciation</h3>
          <Textfield
            register={register}
            name="medication"
            placeholder="Specify"
            defaultValue={data?.medication}
          />
        </div>
      </div>
      <div className="flex-1">
        <h3>Dietary Restrictions</h3>
        <Checkbox
          register={register}
          name="dietary"
          options={dietaryList}
          defaultValue={data?.dietary}
          defaultOtherValue={data?.otherString}
          className="sm:grid-cols-2 min-[1150px]:grid-cols-3"
        />
      </div>
    </div>
  );
}
