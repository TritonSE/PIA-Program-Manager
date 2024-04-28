import Image from "next/image";
import { Dispatch, SetStateAction, useContext, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Student, createStudent, editStudent } from "../api/students";
import { cn } from "../lib/utils";

import { Button } from "./Button";
import ContactInfo from "./StudentForm/ContactInfo";
import StudentBackground from "./StudentForm/StudentBackground";
import StudentInfo from "./StudentForm/StudentInfo";
import { StudentData, StudentFormData } from "./StudentForm/types";
import { ProgramsContext } from "./StudentsTable/StudentsTable";
import { StudentMap } from "./StudentsTable/types";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";

import { UserContext } from "@/contexts/user";

type BaseProps = {
  classname?: string;
  setAllStudents: Dispatch<SetStateAction<StudentMap>>;
};

type EditProps = BaseProps & {
  type: "edit";
  data: Student | null;
};

type AddProps = BaseProps & {
  type: "add";
  data?: Student | null;
};

type StudentFormProps = EditProps | AddProps;

export default function StudentFormButton({
  type,
  data = null, //Student data so form can be populated
  setAllStudents, //Update state of allStudents after creating or editing student
  classname,
}: StudentFormProps) {
  const {
    register,
    setValue: setCalendarValue,
    reset,
    handleSubmit,
  } = useForm<StudentFormData>({
    defaultValues: { varying_programs: [], regular_programs: [], dietary: [] },
  });
  //Default values can be set for all fields but I specified these three fields because the checkbox value can sometimes be a string if it's a single value rather than array of strings. https://github.com/react-hook-form/react-hook-form/releases/tag/v7.30.0

  const [openForm, setOpenForm] = useState(false);
  const programsMap = useContext(ProgramsContext);
  const allPrograms = useMemo(() => Object.values(programsMap), [programsMap]);
  const { isAdmin } = useContext(UserContext);

  const onFormSubmit: SubmitHandler<StudentFormData> = (formData: StudentFormData) => {
    const programAbbreviationToId = {} as Record<string, string>; // abbreviation -> programId
    allPrograms.forEach((program) => (programAbbreviationToId[program.abbreviation] = program._id));

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
      birthday: new Date(formData.birthdate),
      intakeDate: new Date(formData.intake_date),
      tourDate: new Date(formData.tour_date),
      programs: formData.regular_programs
        .map((abbreviation) => ({
          programId: programAbbreviationToId[abbreviation],
          status: "Joined",
          dateUpdated: new Date(),
          hoursLeft: 0,
        }))
        .concat(
          formData.varying_programs.map((abbreviation) => ({
            programId: programAbbreviationToId[abbreviation],
            status: "Joined",
            dateUpdated: new Date(),
            hoursLeft: 0,
          })),
        ),
      dietary: formData.dietary,
      otherString: formData.other,
    };

    console.log(transformedData);

    if (type === "add") {
      createStudent(transformedData).then(
        (result) => {
          if (result.success) {
            const newStudent = result.data;
            reset(); // only clear form on success
            setOpenForm(false);
            console.log("Student created successfully");
            setAllStudents((prevStudents: StudentMap) => {
              return { ...prevStudents, [newStudent._id]: { ...newStudent } };
            });
            console.log(newStudent);
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

    if (type === "edit" && data) {
      const editedData: Student = { ...transformedData, _id: data._id };
      editStudent(editedData).then(
        (result) => {
          if (result.success) {
            const editedStudent = result.data;
            setOpenForm(false);
            setAllStudents((prevStudents: StudentMap) => {
              if (Object.keys(prevStudents).includes(editedStudent._id)) {
                return { ...prevStudents, [editedStudent._id]: { ...editedStudent } };
              } else {
                console.log("Student ID is invalid");
                alert("Student ID is invalid");
                return prevStudents;
              }
            });
            console.log(editedStudent);
          } else {
            console.log(result.error);
            alert("Unable to edit student: " + result.error);
          }
        },
        (error) => {
          console.log(error);
        },
      );
    }
  };

  return (
    <Dialog open={openForm} onOpenChange={setOpenForm}>
      <DialogTrigger asChild>
        {type === "edit" ? (
          <Image
            src="/eye.svg"
            alt="view student"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        ) : (
          <Button
            label={"＋ Add Student"}
            onClick={() => {
              setOpenForm(true);
            }}
          />
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[95%] max-w-[98%] rounded-[13px] sm:max-w-[80%]">
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className={cn(
            "flex flex-col justify-between gap-5 rounded-md bg-white px-[calc(3vw+2px)] py-10 sm:p-10",
            classname,
          )}
        >
          <fieldset disabled={!isAdmin}>
            <legend className="mb-5 w-full text-left font-bold">Contact Information</legend>
            <ContactInfo register={register} data={data ?? null} type={type} />
          </fieldset>
          <fieldset disabled={!isAdmin}>
            <legend className="mb-5 w-full text-left font-bold">Student Background</legend>
            <StudentBackground
              register={register}
              data={data ?? null}
              setCalendarValue={setCalendarValue}
            />
          </fieldset>
          <fieldset disabled={!isAdmin}>
            <legend className="mb-5 w-full text-left font-bold">Student Information</legend>
            <StudentInfo
              register={register}
              data={data ?? null}
              setCalendarValue={setCalendarValue}
            />
          </fieldset>
          <div className="ml-auto mt-5 flex gap-5">
            {/* Modal Confirmation Dialog */}
            {isAdmin ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button label="Cancel" kind="secondary" />
                </DialogTrigger>
                <Button label="Save Changes" type="submit" />
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
            ) : (
              <Button
                label="Exit"
                kind="secondary"
                onClick={() => {
                  setOpenForm(false);
                }}
              />
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
