import Image from "next/image";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import PlusIcon from "../../public/icons/plus.svg";
import { Student, createStudent, editStudent } from "../api/students";
import { cn } from "../lib/utils";

import { Button } from "./Button";
import ContactInfo from "./StudentForm/ContactInfo";
import EnrollmentsEdit from "./StudentForm/EnrollmentsEdit";
import StudentBackground from "./StudentForm/StudentBackground";
import StudentInfo from "./StudentForm/StudentInfo";
import { StudentData, StudentFormData } from "./StudentForm/types";
import { StudentMap } from "./StudentsTable/types";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";

import { ProgramsContext } from "@/contexts/program";
import { UserContext } from "@/contexts/user";
import { amPmToTime } from "@/lib/sessionTimeParsing";

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

export const FormContext = createContext({} as StudentFormData);

export default function StudentFormButton({
  type,
  data = null, //Student data so form can be populated
  setAllStudents, //Update state of allStudents after creating or editing student
  classname,
}: StudentFormProps) {
  const methods = useForm<StudentFormData>();

  const { reset, handleSubmit } = methods;
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
      _id: data?._id,
      student: {
        firstName: formData.studentName,
        lastName: formData.studentLast,
        email: formData.studentEmail,
        phoneNumber: formData.studentPhone,
      },
      emergency: {
        firstName: formData.emergencyName,
        lastName: formData.emergencyLast,
        email: formData.emergencyEmail,
        phoneNumber: formData.emergencyPhone,
      },
      serviceCoordinator: {
        firstName: formData.serviceCoordinatorName,
        lastName: formData.serviceCoordinatorLast,
        email: formData.serviceCoordinatorEmail,
        phoneNumber: formData.serviceCoordinatorPhone,
      },
      location: formData.address,
      medication: formData.medication,
      birthday: new Date(formData.birthdate),
      intakeDate: new Date(formData.intakeDate),
      tourDate: new Date(formData.tourDate),
      enrollments: formData?.regularEnrollments
        .map((enrollment) => {
          console.log("enrollment regular: ", enrollment);
          return {
            ...enrollment,
            dateUpdated: new Date(enrollment.dateUpdated),
            startDate: new Date(enrollment.startDate),
            renewalDate: new Date(enrollment.renewalDate),
            sessionTime: amPmToTime(enrollment.sessionTime)[0],
          };
        })
        .concat(
          formData?.varyingEnrollments.map((enrollment) => {
            console.log("enrollment varying: ", enrollment);

            return {
              ...enrollment,
              dateUpdated: new Date(enrollment.dateUpdated),
              startDate: new Date(enrollment.startDate),
              renewalDate: new Date(enrollment.renewalDate),
              sessionTime: amPmToTime(enrollment.sessionTime)[0],
            };
          }),
        ),
      conservation: formData.conservation === "yes",
      UCINumber: formData.UCINumber,
      incidentForm: formData.incidentForm,
      documents: formData.documents || [], // TODO: add documents support
      profilePicture: formData.profilePicture,
    };

    console.log("form data: ", transformedData);

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
            label="Add Student"
            icon={<PlusIcon />}
            onClick={() => {
              setOpenForm(true);
            }}
          />
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[95%] max-w-[98%] rounded-[13px] sm:max-w-[80%]">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className={cn(
              "flex flex-col justify-between gap-5 rounded-md bg-white px-[calc(3vw+2px)] py-10 sm:p-10",
              classname,
            )}
          >
            <fieldset disabled={!isAdmin}>
              <legend className="mb-5 w-full text-left text-lg font-bold">
                Contact Information
              </legend>
              <ContactInfo data={data ?? null} type={type} />
            </fieldset>
            <div className="grid w-full gap-5 lg:grid-cols-2">
              <fieldset disabled={!isAdmin}>
                <legend className="mb-5 w-full text-left text-lg font-bold">
                  Student Background
                </legend>
                <StudentBackground data={data ?? null} />
              </fieldset>
              <fieldset disabled={!isAdmin}>
                <legend className="mb-5 w-full text-left text-lg font-bold">
                  Student Information
                </legend>

                <StudentInfo data={data ?? null} />
              </fieldset>
            </div>
            <div className="grid w-full gap-5 lg:grid-cols-2">
              <fieldset disabled={!isAdmin}>
                <EnrollmentsEdit data={data ?? null} varying={false} />
              </fieldset>
              <fieldset disabled={!isAdmin}>
                <EnrollmentsEdit data={data ?? null} varying />
              </fieldset>
            </div>

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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
