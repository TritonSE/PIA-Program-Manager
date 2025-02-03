import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";

import { Enrollment } from "../api/programs";
import { Student, deleteStudent, getStudent } from "../api/students";
import { ProgramsContext } from "../contexts/program";
import { UserContext } from "../contexts/user";

import LoadingSpinner from "./LoadingSpinner";
import ModalConfirmation from "./Modals/ModalConfirmation";
import StudentForm from "./StudentForm/StudentForm";
import { Contact } from "./StudentForm/types";
import StudentProfilePrintComponent from "./StudentProfilePrintComponent";
import { Textfield } from "./Textfield";

import { getPhoto } from "@/api/user";

// Aggregate only the fields necessary for display on frontend
// to reduce confusion when managing programs/programlinks/enrollments
export type EnrollmentDisplayInfo = {
  name: string;
  type: string;
  status: string;
  abbreviation: string;
  startDate: Date;
  renewalDate: Date;
  authNumber: string;
  sessionTime: {
    start_time: string;
    end_time: string;
  };
  schedule: string[];
};

type StudentProfileProps = {
  id: string;
};

type ContactLayoutProps = {
  contact: Contact;
  header: string;
  children?: JSX.Element | JSX.Element[];
};

type ProgramLayoutProps = {
  enrollmentInfo: EnrollmentDisplayInfo;
};

function formatDate(d: Date) {
  const date = new Date(d);
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
}

function ArrowHome() {
  return (
    <Link href="/home">
      <svg width="25" height="20" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.10752 3.63111C0.878224 3.86041 0.878224 4.23216 1.10752 4.46146L4.04322 7.39716C4.27252 7.62646 4.64427 7.62646 4.87357 7.39716C5.10286 7.16787 5.10286 6.79611 4.87357 6.56682L2.94017 4.63343L8.56838 4.63343C8.89265 4.63343 9.15553 4.37055 9.15553 4.04629C9.15553 3.72202 8.89265 3.45914 8.56838 3.45914L2.94017 3.45914L4.87357 1.52575C5.10286 1.29646 5.10286 0.9247 4.87357 0.695407C4.64427 0.466114 4.27252 0.466114 4.04322 0.695407L1.10752 3.63111Z"
          fill="black"
        />
      </svg>
    </Link>
  );
}

function ContactLayout({ contact, header, children }: ContactLayoutProps) {
  return (
    <div id={header.toLowerCase()} className="basis-1/2 space-y-[20px] break-all">
      <div className="font-[Poppins-Bold] text-[28px]">{header}:</div>
      <div className="font-[Poppins] text-[24px]">
        Name: {contact.firstName + " " + contact.lastName}
      </div>
      <div className="font-[Poppins] text-[24px]">Email: {contact.email}</div>
      <div className="font-[Poppins] text-[24px]">Phone: {contact.phoneNumber}</div>
      {children}
    </div>
  );
}

function ProgramLayout({ enrollmentInfo }: ProgramLayoutProps) {
  const regular = enrollmentInfo.type === "regular";
  return (
    <>
      <div className="flex space-x-[5px] font-[Poppins-Bold] text-[24px]">
        <div>{enrollmentInfo.abbreviation} -</div>
        {(() => {
          switch (enrollmentInfo.status) {
            case "Joined":
              return <div className="font-bold text-pia_dark_green">Joined</div>;
            case "Waitlisted":
              return <div className="font-bold text-secondary_red">Waitlist</div>;
            case "Archived":
              return <div className="font-bold text-archived_gray">Archived</div>;
            case "Not a fit":
              return <div className="font-bold text-notafit_red">Not a Fit</div>;
            default:
              return <></>;
          }
        })()}
      </div>
      <div className="font-[Poppins] text-[24px]">
        Start Date: {formatDate(enrollmentInfo.startDate)}
      </div>
      <div className="font-[Poppins] text-[24px]">
        End Date: {formatDate(enrollmentInfo.renewalDate)}
      </div>
      <div className="font-[Poppins] text-[24px]">
        Authorization Code: {enrollmentInfo.authNumber}{" "}
      </div>
      {regular && (
        <div className="font-[Poppins] text-[24px]">
          Session Time:
          {" " +
            enrollmentInfo.sessionTime.start_time +
            " - " +
            enrollmentInfo.sessionTime.end_time}
        </div>
      )}
      <>
        <div className="font-[Poppins] text-[24px]">Days of the Week</div>
        <div className="flex space-x-[15px]">
          {["M", "T", "W", "Th", "F", "Sa", "Su"].map((value) => {
            if (
              enrollmentInfo.schedule.find((day) => {
                return day === value;
              })
            )
              return (
                <div
                  key={value}
                  className="relative flex items-center justify-center rounded-full border border-pia_border bg-pia_secondary_green p-[20px] text-center text-pia_primary_white"
                >
                  <div className="absolute">{value}</div>
                </div>
              );
            return (
              <div
                key={value}
                className="relative flex items-center justify-center rounded-full border border-pia_border p-[20px] text-center"
              >
                <div className="absolute">{value}</div>
              </div>
            );
          })}
        </div>
      </>
    </>
  );
}

export default function StudentProfile({ id }: StudentProfileProps) {
  const [currentView, setCurrentView] = useState<"View" | "Edit">("View");
  const { firebaseUser, isAdmin } = useContext(UserContext);
  const [firebaseToken, setFirebaseToken] = useState<string>();
  const [notFound, setNotFound] = useState<boolean>(false);
  const [studentData, setStudentData] = useState<Student>();
  const [enrollmentInfo, setEnrollmentInfo] = useState<EnrollmentDisplayInfo[]>();
  const [image, setImage] = useState<string>("");
  const { allPrograms } = useContext(ProgramsContext);
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const { register: deleteRegister, getValues: getDeleteValue } = useForm<{ lastname: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const router = useRouter();

  const handleViewChange = () => {
    setCurrentView(currentView === "View" ? "Edit" : "View");
  };

  const TruncateDocument = ({
    documentName,
    documentLength,
  }: {
    documentName: string;
    documentLength: number;
  }) => {
    const minLength = 9; // Shortest truncation
    const maxLength = 20; // Longest truncation
    const baseName = documentName.slice(0, documentName.lastIndexOf("."));

    // Use an inverse relationship: fewer documents = longer names
    const dynamicLength = Math.max(
      minLength,
      Math.min(maxLength, 20 - Math.floor((documentLength - 1) * 2)),
    );

    // Only truncate and add ellipsis if the basename is longer than dynamicLength
    const displayName =
      baseName.length > dynamicLength ? baseName.substring(0, dynamicLength) + "..." : baseName;

    return displayName;
  };

  const deleteStudentHandler: MouseEventHandler = () => {
    const lastName = getDeleteValue("lastname");
    if (studentData && firebaseToken && studentData.student.lastName === lastName) {
      deleteStudent(studentData._id, firebaseToken)
        .then((result) => {
          if (result.success) {
            //console.log("Deletion Successful");
            router.push("/home");
          } else console.log(result.error);
        })
        .catch((error) => {
          console.log(error);
        });
    } else alert("Please enter the student's last name (case-sensitive)");
  };

  useEffect(() => {
    if (firebaseToken) {
      getStudent(id, firebaseToken)
        .then((result) => {
          if (result.success) {
            const studentResult = result.data;
            setStudentData(studentResult);
          } else {
            setNotFound(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [firebaseToken]);

  // Get student image
  useEffect(() => {
    if (!studentData || !firebaseToken) return;
    if (studentData.profilePicture === "default") {
      setImage("default");
      return;
    }
    getPhoto(studentData.profilePicture, studentData._id, "student", firebaseToken).then(
      (photoResult) => {
        if (photoResult.success) {
          const newImage = photoResult.data;
          setImage(newImage);
        } else {
          console.error(photoResult.error);
        }
      },
      (error) => {
        console.error(error);
      },
    );
  }, [studentData]);

  useEffect(() => {
    if (studentData) {
      setEnrollmentInfo(
        studentData.enrollments.map((value) => {
          return {
            ...allPrograms[value.programId],
            ...(value as unknown as Enrollment),
          };
        }),
      );
    }
  }, [studentData]);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        .getIdToken()
        .then((token) => {
          setFirebaseToken(token);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [firebaseUser]);

  const getAbsoluteUrl = (url: string) => {
    if (!url) return url;
    // Check if the URL is already absolute
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    if (url.startsWith("www.")) {
      // Prepend the protocol if the URL is missing it
      return `https://${url.slice(4)}`;
    }
    // Prepend the base URL if the URL is relative
    return `${window.location.origin}${url}`;
  };

  if (notFound) {
    return (
      <main className="mx-[30px] space-y-[60px]">
        <ArrowHome />
        <div className="font-[alternate-gothic] text-4xl text-[96px]">Student Not Found</div>
      </main>
    );
  }
  return (
    studentData &&
    enrollmentInfo && (
      <main className="mx-[30px] space-y-[60px]">
        <div id="top" className="flex justify-between">
          <ArrowHome />
          {/*no need to set all students*/}
          <button
            className="flex cursor-pointer space-x-[5px]"
            type="button"
            onClick={() => {
              handleViewChange();
            }}
          >
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
            <div>{currentView === "Edit" ? "View" : "Edit"} Mode</div>
          </button>
        </div>

        {currentView === "View" ? (
          <>
            <div id="ult header" ref={contentRef.current} className="flex">
              <div id="header" className="mt-[20px] w-3/5 space-y-[60px]">
                <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap font-[alternate-gothic] text-[96px] leading-none">
                  {studentData.student.firstName + " " + studentData.student.lastName}
                </div>

                <div id="contact" className="font-[Poppins-Bold] text-[21px] ">
                  <div id="line 1" className="flex flex-wrap ">
                    <div className="mb-[16px] mr-[40px] flex space-x-[20px]">
                      <svg
                        width="29"
                        height="23"
                        viewBox="0 0 29 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.46721 22.7553C2.71541 22.7553 2.07206 22.4878 1.53714 21.9529C1.00222 21.418 0.73431 20.7742 0.733398 20.0215V3.61858C0.733398 2.86678 1.00131 2.22342 1.53714 1.68851C2.07297 1.15359 2.71632 0.885677 3.46721 0.884766H25.3377C26.0895 0.884766 26.7333 1.15268 27.2692 1.68851C27.805 2.22433 28.0724 2.86769 28.0715 3.61858V20.0215C28.0715 20.7733 27.8041 21.4171 27.2692 21.9529C26.7342 22.4887 26.0904 22.7562 25.3377 22.7553H3.46721ZM14.4025 13.1869L3.46721 6.35239V20.0215H25.3377V6.35239L14.4025 13.1869ZM14.4025 10.4531L25.3377 3.61858H3.46721L14.4025 10.4531ZM3.46721 6.35239V3.61858V20.0215V6.35239Z"
                          fill="#202124"
                        />
                      </svg>
                      <div className="w-full">{studentData.student.email} </div>
                    </div>
                    <div className="flex space-x-[20px]">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.39803 17.1203C13.2124 21.9337 17.6737 22.4608 18.9834 22.5096C20.5661 22.5672 22.1813 21.2753 22.88 19.9521C21.7656 18.6451 20.3144 17.6311 18.7255 16.532C17.7877 17.4684 16.6319 19.2084 15.0931 18.585C14.2179 18.2332 12.0567 17.238 10.1685 15.349C8.27908 13.4612 7.2849 11.3004 6.93055 10.4266C6.30699 8.88561 8.05244 7.72764 8.99028 6.79C7.89092 5.1751 6.89424 3.68663 5.58953 2.62881C4.24726 3.32985 2.94756 4.93224 3.00641 6.53587C3.05525 7.84531 3.58239 12.3057 8.39803 17.1203ZM18.8908 25.0121C17.0877 24.9457 11.9778 24.2397 6.62628 18.8905C1.27599 13.54 0.571048 8.43244 0.503433 6.62851C0.403264 3.87942 2.50932 1.2092 4.94219 0.166404C5.23515 0.0399249 5.55598 -0.00822968 5.87317 0.0266659C6.19037 0.0615615 6.49305 0.178308 6.75149 0.36545C8.7649 1.83388 10.1535 4.05844 11.3468 5.80103C11.595 6.16338 11.7087 6.60109 11.6682 7.03842C11.6278 7.47575 11.4357 7.88517 11.1251 8.19583L9.42727 9.89461C9.82169 10.7647 10.6243 12.2644 11.939 13.5788C13.2537 14.8933 14.7538 15.6957 15.6252 16.0901L17.3219 14.3925C17.6338 14.0814 18.045 13.8896 18.4839 13.8505C18.9227 13.8114 19.3614 13.9274 19.7234 14.1785C21.5014 15.4103 23.59 16.7786 25.1125 18.7277C25.3149 18.988 25.4436 19.2978 25.4853 19.6249C25.5269 19.9519 25.4799 20.2841 25.3492 20.5867C24.3012 23.0316 21.6492 25.1135 18.8908 25.0121Z"
                          fill="black"
                        />
                      </svg>
                      <div>{studentData.student.phoneNumber}</div>
                    </div>
                  </div>
                  <div className="flex space-x-[20px]">
                    <svg
                      width="35"
                      height="36"
                      viewBox="0 0 35 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <rect y="0.322266" width="35" height="35" fill="url(#pattern0_4713_48633)" />
                      <defs>
                        <pattern
                          id="pattern0_4713_48633"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use xlinkHref="#image0_4713_48633" transform="scale(0.0111111)" />
                        </pattern>
                        <image
                          id="image0_4713_48633"
                          width="90"
                          height="90"
                          xlinkHref="data:image/png;base64,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"
                        />
                      </defs>
                    </svg>
                    <div className="">{`UCI # ${studentData.UCINumber}`}</div>
                  </div>
                </div>
              </div>
              {/*profile picture*/}
              {image !== "" ? (
                <div>
                  <Image
                    alt="Profile Picture"
                    src={image !== "default" ? image : "/defaultProfilePic.svg"}
                    width={190}
                    height={190}
                    className="aspect-square rounded-full object-cover"
                  />
                </div>
              ) : (
                <LoadingSpinner classname="h-auto w-auto" label="Loading Image..." />
              )}
            </div>
            <div id="row1" className="flex space-x-[230px]">
              <ContactLayout contact={studentData.emergency} header="Emergency Contact">
                <div className="flex space-x-[10px] font-[Poppins] text-[24px]">
                  <div>Conserved: </div>
                  {studentData.conservation ? (
                    <div className="font-bold text-pia_dark_green">Yes</div>
                  ) : (
                    <div className="font-bold text-secondary_red">No</div>
                  )}
                </div>
              </ContactLayout>
              <ContactLayout
                contact={studentData.serviceCoordinator}
                header="Service Coordinator"
              />
            </div>

            <div id="row2" className="flex space-x-[230px]">
              <div id="student background" className="basis-1/2 space-y-[20px]">
                <div className="font-[Poppins-Bold] text-[28px]">Student Background:</div>
                <div className="font-[Poppins] text-[24px]">Address: {studentData.location}</div>
                <div className="font-[Poppins] text-[24px]">
                  Birthdate: {studentData.birthday ? formatDate(studentData.birthday) : "N/A"}
                </div>
              </div>
              <div id="student information" className="basis-1/2 space-y-[20px]">
                <div className="font-[Poppins-Bold] text-[28px]">Student Information:</div>
                <div className="font-[Poppins] text-[24px]">
                  Intake Date: {studentData.intakeDate ? formatDate(studentData.intakeDate) : "N/A"}
                </div>
                <div className="font-[Poppins] text-[24px]">
                  Tour Date: {studentData.tourDate ? formatDate(studentData.tourDate) : "N/A"}
                </div>
              </div>
            </div>
            <div id="row3" className="flex space-x-[230px]">
              <div id="documents" className="basis-1/2 space-y-[20px]">
                <div className="font-[Poppins-Bold] text-[28px]">Documents</div>
                <div className="flex space-x-[20px]">
                  {studentData.documents?.map((doc, index) => (
                    <button
                      onClick={() => {
                        window.open(doc.link, "_blank");
                      }}
                      key={index}
                      className={
                        index % 2 === 0
                          ? "h-[48px] w-[116px] rounded-lg border border-pia_border bg-pia_light_gray"
                          : "h-[48px] w-[116px] rounded-lg border border-pia_border bg-pia_secondary_green text-pia_primary_white"
                      }
                    >
                      {TruncateDocument({
                        documentName: doc.name,
                        documentLength: doc.name.length,
                      }) || `Document ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>
              <div id="medications" className="basis-1/2 space-y-[20px]">
                <div className="font-[Poppins-Bold] text-[28px]">Medication & Medical</div>
                <div className="font-[Poppins] text-[24px]">{studentData.medication}</div>
              </div>
            </div>
            {studentData.incidentForm && (
              <div>
                <div className="font-[Poppins-Bold] text-[28px]">Incident Form</div>
                <button
                  onClick={() => {
                    window.open(getAbsoluteUrl(studentData.incidentForm), "_blank");
                  }}
                  className="h-[48px] w-[116px] rounded-lg border border-pia_border bg-pia_light_gray"
                >
                  Link
                </button>
              </div>
            )}
            <div id="row4" className="flex space-x-[230px]">
              <div id="regular" className="basis-1/2 space-y-[20px]">
                <div className="font-[Poppins-Bold] text-[28px]">Regular Programs:</div>
                {enrollmentInfo.map((value, index) => {
                  if (value.type === "regular")
                    return <ProgramLayout enrollmentInfo={value} key={"regular" + index} />;
                  return <></>;
                })}
              </div>
              <div id="varying" className="basis-1/2 space-y-[20px]">
                <div className="font-[Poppins-Bold] text-[28px]">Varying Programs:</div>
                {enrollmentInfo.map((value, index) => {
                  if (value.type === "varying")
                    return <ProgramLayout enrollmentInfo={value} key={"varying" + index} />;
                  return <></>;
                })}
              </div>
            </div>
            {/* <div className="my-[30px] ml-[20px] mr-[80px] space-y-[20px]">
            <div className="font-[alternate-gothic] text-4xl uppercase">Notifications</div>
            <div className="font-[Poppins] text-[16px]">
              Review information of new account creations below to approve or deny them.{" "}
            </div>
            <NotificationTable />
          </div> */}

            <div id="Bottom Buttons" className="flex justify-between">
              {isAdmin && (
                <ModalConfirmation
                  className="h-[60%] w-[40%] rounded-[8px]"
                  title="Are you sure you want to delete this student?"
                  innerContent={
                    <>
                      <div className="flex w-[60%] justify-center">
                        <div className="font-base text-sm sm:text-base">
                          <li className="font-bold text-destructive">This cannot be undone!</li>
                          <li>
                            This will remove this student from all enrolled programs and delete all
                            notes and documents.
                          </li>
                        </div>
                      </div>
                      <div className="mx-8 mb-8 mt-6">
                        Enter the student&apos;s last name to proceed
                        <Textfield
                          name="lastname"
                          placeholder="Last Name"
                          register={deleteRegister}
                        />
                      </div>
                    </>
                  }
                  kind="destructive"
                  triggerElement={
                    <button className="h-[48px] w-[96px] rounded-sm border border-pia_border text-pia_border">
                      Delete
                    </button>
                  }
                  confirmText="Delete"
                  icon={<div />}
                  isParentOpen={deleteDialogOpen}
                  setIsParentOpen={setDeleteDialogOpen}
                  onConfirmClick={deleteStudentHandler}
                />
              )}
              <button
                className="h-[48px] w-[96px] rounded-sm border border-pia_dark_green bg-pia_dark_green text-pia_primary_white"
                onClick={() => {
                  reactToPrintFn();
                }}
              >
                Print
              </button>
              <div className="hidden">
                <StudentProfilePrintComponent
                  data={studentData}
                  contentRef={contentRef}
                  enrollments={enrollmentInfo}
                />
              </div>
            </div>
          </>
        ) : (
          <StudentForm
            type="edit"
            data={studentData}
            setCurrentView={setCurrentView}
            setStudentData={setStudentData}
          />
        )}
      </main>
    )
  );
}
