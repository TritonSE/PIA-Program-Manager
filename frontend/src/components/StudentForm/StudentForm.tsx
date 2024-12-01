import { ObjectId } from "bson";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Student, createStudent, editStudent } from "../../api/students";
import { cn } from "../../lib/utils";
import { Button } from "../Button";
import SaveCancelButtons from "../Modals/SaveCancelButtons";
import { StudentMap } from "../StudentsTable/types";

import ContactInfo from "./ContactInfo";
import EnrollmentsEdit from "./EnrollmentsEdit";
import StudentBackground from "./StudentBackground";
import StudentInfo from "./StudentInfo";
import { useHandleImageDocumentUpload } from "./hooks/useHandleImageDocumentUpload";
import { Document, StudentData, StudentFormData } from "./types";

import { ProgramsContext } from "@/contexts/program";
import { StudentsContext } from "@/contexts/students";
import { UserContext } from "@/contexts/user";

type BaseProps = {
  classname?: string;
  setCurrentView: Dispatch<SetStateAction<"View" | "Edit">>;
  // Used to update single student data if editing on StudentProfile page
  setStudentData?: Dispatch<SetStateAction<Student | undefined>>;
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

export default function StudentForm({
  type,
  data = null, //Student data so form can be populated
  classname,
  setCurrentView,
  setStudentData,
}: StudentFormProps) {
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const router = useRouter();
  const methods = useForm<StudentFormData>();
  const { handleSubmit } = methods;
  const { setAllStudents } = useContext(StudentsContext);
  const { allPrograms } = useContext(ProgramsContext);
  const { isAdmin, firebaseUser } = useContext(UserContext);
  const [firebaseToken, setFirebaseToken] = useState("");

  const newStudentId = new ObjectId().toHexString();
  const newImageId = new ObjectId().toHexString();

  const [imageFormData, setImageFormData] = useState<FormData | null>(null);
  // These are all uploaded files that are in memory.
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [studentDocuments, setStudentDocuments] = useState<Document[]>(data?.documents ?? []);
  const [didDeleteOrMark, setDidDeleteOrMark] = useState(false);

  const documentData = {
    currentFiles,
    setCurrentFiles,
    studentDocuments,
    setStudentDocuments,
    setDidDeleteOrMark,
  };

  const { handleAddingNewImage, handleUploadingDocument, handleDidDeleteOrMark } =
    useHandleImageDocumentUpload({
      imageDataProp: {
        imageFormData,
        newStudentId,
        newImageId,
        type,
        data,
        firebaseToken,
      },
      documentDataProp: {
        currentFiles,
        studentId: data?._id ?? newStudentId,
        type,
        studentDocuments,
        setStudentDocuments,
        didDeleteOrMark,
        previousDocuments: data?.documents,
      },
    });

  useEffect(() => {
    if (!firebaseUser) return;
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then((token) => {
          setFirebaseToken(token);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);

  const onFormSubmit: SubmitHandler<StudentFormData> = async (formData: StudentFormData) => {
    const programAbbreviationToId = {} as Record<string, string>; // abbreviation -> programId
    Object.values(allPrograms).forEach(
      (program) => (programAbbreviationToId[program.abbreviation] = program._id),
    );

    let newProfilePictureLink = "default";

    if (imageFormData && data?.profilePicture === "default") {
      newProfilePictureLink = newImageId;
    } else {
      newProfilePictureLink = formData.profilePicture;
    }

    const transformedData: StudentData = {
      _id: data?._id ?? newStudentId,
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
            sessionTime: {
              start_time: enrollment.sessionTime.start_time,
              end_time: enrollment.sessionTime.end_time,
            },
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
              sessionTime: {
                start_time: enrollment.sessionTime.start_time,
                end_time: enrollment.sessionTime.end_time,
              },
            };
          }),
        ),
      conservation: formData.conservation === "yes",
      UCINumber: formData.UCINumber,
      incidentForm: formData.incidentForm,
      documents: studentDocuments,
      profilePicture: newProfilePictureLink,
    };

    if (imageFormData) {
      const uploadedImageId = await handleAddingNewImage();
      transformedData.profilePicture = uploadedImageId;
    }

    if (currentFiles.length > 0) {
      const newDocumentData = await handleUploadingDocument();
      transformedData.documents = newDocumentData;
    }

    if (didDeleteOrMark) {
      handleDidDeleteOrMark();

      // If no files were uploaded, we need to update the documents field. Otherwise it is updated by the if statement above.
      if (currentFiles.length === 0) {
        transformedData.documents = studentDocuments;
      }
    }

    if (type === "add") {
      createStudent(transformedData).then(
        (result) => {
          if (result.success) {
            const newStudent = result.data;
            // reset(); // only clear form on success
            console.log("Student created successfully");
            setAllStudents((prevStudents: StudentMap | undefined) => {
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
            if (setStudentData) {
              setStudentData(editedStudent);
            }
            setAllStudents((prevStudents: StudentMap | undefined) => {
              if (!prevStudents) return prevStudents;
              if (Object.keys(prevStudents).includes(editedStudent._id)) {
                return { ...prevStudents, [editedStudent._id]: { ...editedStudent } };
              } else {
                console.log("Student ID is invalid");
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

    setTimeout(() => {
      setCurrentView("View");
    }, 1500);
  };

  return (
    <section className="">
      <FormProvider {...methods}>
        <form className={cn("flex flex-col justify-between gap-y-10 rounded-md", classname)}>
          <fieldset disabled={!isAdmin}>
            <ContactInfo data={data ?? null} type={type} />
          </fieldset>
          <div className="grid w-full gap-10 lg:grid-cols-2">
            <fieldset disabled={!isAdmin}>
              <legend className="mb-5 w-full text-left text-lg font-bold">
                Student Background
              </legend>
              <StudentBackground
                data={data ?? null}
                type={type}
                setImageFormData={setImageFormData}
                firebaseToken={firebaseToken}
              />
            </fieldset>
            <fieldset disabled={!isAdmin}>
              <legend className="mb-5 w-full text-left text-lg font-bold">
                Student Information
              </legend>

              <StudentInfo data={data ?? null} documentData={documentData} />
            </fieldset>
          </div>
          <div className="grid w-full gap-10 lg:grid-cols-2">
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
              <SaveCancelButtons
                isOpen={openSaveDialog}
                onSaveClick={handleSubmit(onFormSubmit)}
                automaticClose={1500} //1.5 seconds
                setOpen={setOpenSaveDialog}
                onLeave={() => {
                  router.push("/home");
                }}
              >
                {/* Save Dialog Content */}
                <div className="grid w-[400px] place-items-center gap-5 min-[450px]:px-12 min-[450px]:pb-12 min-[450px]:pt-10">
                  <button
                    className="ml-auto"
                    onClick={() => {
                      setOpenSaveDialog(false);
                    }}
                  >
                    <Image src="/icons/close.svg" alt="close" width={13} height={13} />
                  </button>
                  <Image src="/icons/green_check_mark.svg" alt="checkmark" width={54} height={54} />
                  <h3 className="text-lg font-bold">Student has been saved!</h3>
                </div>
              </SaveCancelButtons>
            ) : (
              <Button label="Exit" kind="secondary" onClick={() => {}} />
            )}
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
