import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { createStudent } from "../api/students";
import { cn } from "../lib/utils";

import { Button } from "./Button";
import ContactInfo from "./StudentForm/ContactInfo";
import StudentBackground from "./StudentForm/StudentBackground";
import StudentInfo from "./StudentForm/StudentInfo";
import { StudentData, StudentFormData } from "./StudentForm/types";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";

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
      // Syntax is to prevent runtime errors when attempting to make dates with invalid date strings
      birthday: Date.parse(formData.birthdate) ? new Date(formData.birthdate).toISOString() : "",
      intakeDate: Date.parse(formData.intake_date)
        ? new Date(formData.intake_date).toISOString()
        : "",
      tourDate: Date.parse(formData.tour_date) ? new Date(formData.tour_date).toISOString() : "",
      prog1: formData.regular_programs ? formData.regular_programs : ([] as string[]),
      prog2: formData.varying_programs ? formData.varying_programs : ([] as string[]),
      dietary: formData.dietary,
      otherString: formData.other,
    };
    if (type === "add") {
      createStudent(transformedData).then(
        (result) => {
          if (result.success) {
            reset(); // only clear form on success
            handleSubmit?.(result.data);
          } else {
            console.log(result.error);
            alert("Unable to create student: " + result.error);
          }
        },
        (error) => {
          console.log(error);
        },
      );
    }
    //uncomment for testing
    //console.log(`${type} student data:`, transformedData);
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
            <div className="ml-auto mt-5 flex gap-5">
              {/* Modal Confirmation Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button label="Cancel" kind="secondary" />
                </DialogTrigger>
                <DialogContent className="max-h-[30%] max-w-[80%] rounded-[8px] md:max-w-[50%]  lg:max-w-[30%]">
                  <div className="p-3 min-[450px]:p-10">
                    <p className="my-10 text-center">Leave without saving changes?</p>
                    <div className="grid justify-center gap-5 min-[450px]:flex min-[450px]:justify-between">
                      <DialogClose asChild>
                        <Button label="Back" kind="secondary" />
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          label="Continue"
                          onClick={() => {
                            setOpenForm(false);
                          }}
                        />
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <DialogClose asChild>
                <Button label="Save Changes" type="submit" />
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
