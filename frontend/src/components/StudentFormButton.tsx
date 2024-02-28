import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { cn } from "../lib/utils";

import { Button } from "./Button";
import SaveCancelButtons from "./SaveCancelButtons";
import ContactInfo from "./StudentForm/ContactInfo";
import StudentBackground from "./StudentForm/StudentBackground";
import StudentInfo from "./StudentForm/StudentInfo";
import { StudentData, StudentFormData } from "./StudentForm/types";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type BaseProps = {
  classname?: string;
};

type EditProps = BaseProps & {
  type: "edit";
  data: StudentData | null;
};

type AddProps = BaseProps & {
  type: "add";
  data?: StudentData | null;
};

type StudentFormProps = EditProps | AddProps;

export default function StudentFormButton({
  type = "edit",
  data = null,
  classname,
}: StudentFormProps) {
  const { register, setValue: setCalendarValue, reset, handleSubmit } = useForm<StudentFormData>();

  const onSubmit: SubmitHandler<StudentFormData> = (formData: StudentFormData) => {
    const transformedData: StudentData = {
      student: {
        firstName: formData.student_name,
        lastName: formData.student_last,
        email: formData.student_email,
        phoneNumber: formData.student_phone,
      },
      emergency: {
        firstName: formData.emergency_name,
        lastName: formData.emergency_last,
        email: formData.emergency_email,
        phoneNumber: formData.emergency_phone,
      },
      serviceCoordinator: {
        firstName: formData.serviceCoordinator_name,
        lastName: formData.serviceCoordinator_last,
        email: formData.serviceCoordinator_email,
        phoneNumber: formData.serviceCoordinator_phone,
      },
      location: formData.address,
      medication: formData.medication,
      birthday: formData.birthdate,
      intakeDate: formData.intake_date,
      tourDate: formData.tour_date,
      prog1: formData.regular_programs,
      prog2: formData.regular_programs,
      dietary: formData.dietary,
      otherString: formData.other,
    };
    reset(); //Clear form
    console.log(`${type} student data:`, transformedData);
  };

  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogTrigger asChild>
          <Button
            label={type === "add" ? "Add Student" : "View Profile"}
            onClick={() => {
              setOpenForm(true);
            }}
          />
        </DialogTrigger>
        <DialogContent className="max-h-[95%] max-w-[98%] rounded-[13px] sm:max-w-[80%]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "flex flex-col justify-between gap-5 rounded-md bg-white px-[calc(3vw+2px)] py-10 sm:p-10",
              classname,
            )}
          >
            <fieldset>
              <legend className="mb-5 w-full text-left font-bold">Contact Information</legend>
              <ContactInfo register={register} data={data ?? null} type={type} />
            </fieldset>
            <fieldset>
              <legend className="mb-5 w-full text-left font-bold">Student Background</legend>
              <StudentBackground
                register={register}
                data={data ?? null}
                setCalendarValue={setCalendarValue}
              />
            </fieldset>
            <fieldset>
              <legend className="mb-5 w-full text-left font-bold">Student Information</legend>
              <StudentInfo
                register={register}
                data={data ?? null}
                setCalendarValue={setCalendarValue}
              />
            </fieldset>
            <SaveCancelButtons setOpen={setOpenForm} />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
