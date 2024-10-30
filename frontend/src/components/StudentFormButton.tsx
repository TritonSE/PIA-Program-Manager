import { Dispatch, SetStateAction, useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import PlusIcon from "../../public/icons/plus.svg";
import { Student, createStudent, editStudent } from "../api/students";
import { cn } from "../lib/utils";

import { Button } from "./Button";
import ContactInfo from "./StudentForm/ContactInfo";
import StudentBackground from "./StudentForm/StudentBackground";
import StudentInfo from "./StudentForm/StudentInfo";
import { StudentData, StudentFormData } from "./StudentForm/types";
import { StudentMap } from "./StudentsTable/types";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";

import { ProgramsContext } from "@/contexts/program";
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
  const { allPrograms } = useContext(ProgramsContext);
  const { isAdmin } = useContext(UserContext);

  const onFormSubmit: SubmitHandler<StudentFormData> = (formData: StudentFormData) => {
    const programAbbreviationToId = {} as Record<string, string>; // abbreviation -> programId
    Object.values(allPrograms).forEach(
      (program) => (programAbbreviationToId[program.abbreviation] = program._id),
    );

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
          <div className="flex cursor-pointer space-x-[5px]">
            <svg
              width="20"
              height="22"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.02645 1.38024C8.86568 1.21944 8.67481 1.09189 8.46475 1.00486C8.25468 0.917838 8.02953 0.873047 7.80215 0.873047C7.57477 0.873047 7.34962 0.917838 7.13955 1.00486C6.92948 1.09189 6.73861 1.21944 6.57785 1.38024L1.37812 6.57996C1.13117 6.82707 0.955067 7.13594 0.868192 7.47432L0.293527 9.71089C0.279277 9.76654 0.279787 9.82494 0.295008 9.88033C0.310229 9.93573 0.339634 9.98619 0.38032 10.0267C0.421006 10.0673 0.471565 10.0965 0.527006 10.1116C0.582447 10.1266 0.640852 10.1269 0.696453 10.1125L2.93236 9.53849C3.27081 9.45177 3.57971 9.27564 3.82672 9.02856L9.02645 3.82884C9.18724 3.66807 9.3148 3.4772 9.40182 3.26713C9.48884 3.05707 9.53364 2.83191 9.53364 2.60454C9.53364 2.37716 9.48884 2.152 9.40182 1.94194C9.3148 1.73187 9.18724 1.541 9.02645 1.38024ZM7.04485 1.84723C7.24569 1.64638 7.5181 1.53355 7.80215 1.53355C8.08619 1.53355 8.3586 1.64638 8.55945 1.84723C8.7603 2.04808 8.87313 2.32049 8.87313 2.60454C8.87313 2.88858 8.7603 3.16099 8.55945 3.36184L8.04489 3.87639L6.53029 2.36179L7.04485 1.84723ZM6.06329 2.82879L7.5779 4.34339L3.35973 8.56156C3.19616 8.72481 2.99177 8.84115 2.76789 8.89843L1.0723 9.33439L1.50825 7.6388C1.56511 7.41474 1.68151 7.21024 1.84512 7.04696L6.06329 2.82879Z"
                fill="black"
              />
            </svg>
            <div>Edit Mode</div>
          </div>
        ) : (
          <Button
            label="Add Student"
            icon={<PlusIcon />}
            onClick={() => {
              setOpenForm(true);
            }}
          />
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85%] max-w-[90%] rounded-[13px] text-sm sm:max-w-[80%]">
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className={cn(
            "flex flex-col justify-between gap-5 rounded-md bg-white px-[calc(3vw+2px)] py-10 sm:p-10",
            classname,
          )}
        >
          <fieldset disabled={!isAdmin}>
            <legend className="mb-5 w-full text-left text-base font-bold">
              Contact Information
            </legend>
            <ContactInfo register={register} data={data ?? null} type={type} />
          </fieldset>
          <fieldset disabled={!isAdmin}>
            <legend className="mb-5 w-full text-left text-base font-bold">
              Student Background
            </legend>
            <StudentBackground
              register={register}
              data={data ?? null}
              setCalendarValue={setCalendarValue}
            />
          </fieldset>
          <fieldset disabled={!isAdmin}>
            <legend className="text-basefont-bold mb-5 w-full text-left">
              Student Information
            </legend>
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
