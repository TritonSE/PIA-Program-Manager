import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { Student } from "../../api/students";
import { cn } from "../../lib/utils";
import { Checkbox } from "../Checkbox";
import { Textfield } from "../Textfield";

import { convertDateToString } from "./StudentBackground";
import { StudentFormData } from "./types";

type StudentInfoProps = {
  register: UseFormRegister<StudentFormData>;
  classname?: string;
  setCalendarValue: UseFormSetValue<StudentFormData>;
  data: Student | null;
};

const regularPrograms = ["Intro", "ENTR"];
const varyingPrograms = ["TDS", "SDP"];

export default function StudentInfo({
  register,
  classname,
  setCalendarValue,
  data,
}: StudentInfoProps) {
  return (
    <div className="grid w-full gap-5 lg:grid-cols-2">
      <div className={cn("grid flex-1 gap-x-3 gap-y-5 md:grid-cols-2", classname)}>
        <div>
          <h3>Intake date</h3>
          <Textfield
            register={register}
            name="intake_date"
            placeholder="00/00/0000"
            calendar={true}
            setCalendarValue={setCalendarValue}
            defaultValue={convertDateToString(data?.intakeDate)}
          />
        </div>
        <div>
          <h3>Tour date</h3>
          <Textfield
            register={register}
            name="tour_date"
            placeholder="00/00/0000"
            calendar={true}
            setCalendarValue={setCalendarValue}
            defaultValue={convertDateToString(data?.tourDate)}
          />
        </div>
      </div>
      <div className="grid gap-y-5">
        <div>
          <h3>Regular Programs</h3>
          <Checkbox
            register={register}
            name="regular_programs"
            options={regularPrograms}
            defaultValue={data?.regularPrograms}
          />
        </div>
        <div>
          <h3>Varying Programs</h3>
          <Checkbox
            register={register}
            name="varying_programs"
            options={varyingPrograms}
            defaultValue={data?.varyingPrograms}
          />
        </div>
      </div>
    </div>
  );
}
