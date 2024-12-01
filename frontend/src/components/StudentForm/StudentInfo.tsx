// Dashed Border Credit: https://kovart.github.io/dashed-border-generator/

import { AlertCircle } from "lucide-react";
import Image from "next/image";
import {
  Dispatch,
  DragEvent,
  Fragment,
  SetStateAction,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";

import CloseIcon from "../../../public/icons/close.svg";
import GreenQuestionIcon from "../../../public/icons/green_question_mark.svg";
import RedDeleteIcon from "../../../public/icons/red_delete.svg";
import { Student } from "../../api/students";
import { cn } from "../../lib/utils";
import { Button } from "../Button";
import ModalConfirmation from "../Modals/ModalConfirmation";
import SaveCancelButtons from "../Modals/SaveCancelButtons";
import { Textfield } from "../Textfield";
import { Dialog, DialogContent } from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { convertDateToString } from "./StudentBackground";
import styles from "./styles/StudentInfo.module.css";
import { Document, StudentFormData } from "./types";

import { ProgramsContext } from "@/contexts/program";

type StudentInfoProps = {
  classname?: string;
  data: Student | null;
  documentData: {
    currentFiles: File[];
    studentDocuments: Document[];
    setCurrentFiles: Dispatch<SetStateAction<File[]>>;
    setStudentDocuments: Dispatch<SetStateAction<Document[]>>;
    setDidDeleteOrMark: Dispatch<SetStateAction<boolean>>;
  };
};

const SUPPORTED_FILETYPES = [
  "application/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
];

export default function StudentInfo({ classname, data, documentData }: StudentInfoProps) {
  const { register, setValue: setCalendarValue } = useFormContext<StudentFormData>();
  const [modalOpen, setModalOpen] = useState(false);
  const [documentError, setDocumentError] = useState("");
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [_openSaveCancel, setOpenSaveCancel] = useState(false);

  const {
    currentFiles,
    studentDocuments,
    setCurrentFiles,
    setStudentDocuments,
    setDidDeleteOrMark,
  } = documentData;
  // These are temporary files that only exist in the upload file modal
  const [modalFiles, setModalFiles] = useState<File[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const existingDocumentNames = studentDocuments.map((doc) => doc.name);

  const { allPrograms: programsMap } = useContext(ProgramsContext);
  const allPrograms = useMemo(() => Object.values(programsMap), [programsMap]);
  if (!allPrograms) return null;

  // console.log("All files in memory (Current Files)", currentFiles);
  // console.log("All files in modal (Modal Files)", modalFiles);
  // console.log("All files including database (Student Documents)", studentDocuments);

  const uploadDocument = () => {
    setDocumentError("");

    // This is invalid because the links are empty. This will be checked before the edit student API is called
    const temporaryDocumentData = modalFiles.map((file) => {
      return { link: "", name: file.name, markedAdmin: false };
    });

    setCurrentFiles((prev) => [...prev, ...modalFiles]);
    setStudentDocuments((prev) => [...prev, ...temporaryDocumentData]);
    setModalOpen(false);
    setModalFiles([]);
  };

  const handleImageUpload = (files: File[] | null) => {
    if (files) {
      const tempFiles = [...Array.from(files)];
      const containsLargeFiles = tempFiles.some((file) => file.size > 10 * 1024 * 1024);
      if (containsLargeFiles) {
        setDocumentError("File size should not exceed 10MB");
        return;
      }
      setDocumentError("");
      const containsInvalidFiles = tempFiles.some(
        (file) => !SUPPORTED_FILETYPES.includes(file.type),
      );
      if (containsInvalidFiles) {
        setDocumentError("Invalid file type. Please upload a PDF, PNG, JPG, or WEBP file.");
        return;
      }
      const duplicateFiles = tempFiles.filter((file) => existingDocumentNames.includes(file.name));
      if (duplicateFiles.length > 0) {
        setDocumentError("Document with this name already exists.");
        return;
      }

      const fileNames = tempFiles.map((file) => file.name);
      const fileSet = new Set(fileNames);

      if (fileSet.size !== fileNames.length) {
        setDocumentError("Duplicate files are not allowed.");
        return;
      }
      setModalFiles(tempFiles);
    }
  };

  const dropHandler = (event: DragEvent<HTMLDivElement>, onFilesDrop: (files: File[]) => void) => {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();

    const droppedFiles: File[] = [];

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface
      Array.from(event.dataTransfer.items).forEach((item) => {
        // Only process if the dropped item is a file
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            droppedFiles.push(file);
          }
        }
      });
    } else {
      // Fallback to DataTransfer interface
      Array.from(event.dataTransfer.files).forEach((file) => {
        droppedFiles.push(file);
      });
    }

    // Call the provided callback with the files
    onFilesDrop(droppedFiles);
  };

  const handleMarkAdmin = (document: Document) => {
    setStudentDocuments((prev) =>
      prev.map((doc) =>
        doc.name === document.name ? { ...doc, markedAdmin: !doc.markedAdmin } : doc,
      ),
    );
  };

  const handleDeleteDocument = (document: Document) => {
    setStudentDocuments((prev) => prev.filter((doc) => doc.name !== document.name));
    setCurrentFiles((prev) => prev.filter((file) => file.name !== document.name));
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
    const extension = documentName.split(".").pop();
    const baseName = documentName.slice(0, documentName.lastIndexOf("."));

    // Use an inverse relationship: fewer documents = longer names
    const dynamicLength = Math.max(
      minLength,
      Math.min(maxLength, 20 - Math.floor((documentLength - 1) * 2)),
    );

    // Only truncate and add ellipsis if the basename is longer than dynamicLength
    const displayName =
      baseName.length > dynamicLength ? baseName.substring(0, dynamicLength) + "..." : baseName;

    return (
      <div className="grid">
        <span>{displayName}</span>
        <span className="text-sm text-gray-500">{extension?.toUpperCase()}</span>
      </div>
    );
  };

  return (
    <div className={cn("grid flex-1 gap-x-8 gap-y-10 md:grid-cols-2", classname)}>
      <div>
        <h3 className="mb-5">Intake date</h3>
        <Textfield
          register={register}
          name="intakeDate"
          placeholder="00/00/0000"
          calendar={true}
          setCalendarValue={setCalendarValue}
          defaultValue={convertDateToString(data?.intakeDate)}
        />
      </div>
      <div>
        <h3 className="mb-5">Tour date</h3>
        <Textfield
          register={register}
          name="tourDate"
          placeholder="00/00/0000"
          calendar={true}
          setCalendarValue={setCalendarValue}
          defaultValue={convertDateToString(data?.tourDate)}
        />
      </div>
      <div className="col-span-2">
        <h3 className="mb-5 w-full text-left text-lg font-bold">Incident Form</h3>
        <Textfield
          register={register}
          name="incidentForm"
          placeholder="http://www.company.com"
          defaultValue={data?.incidentForm}
        />
      </div>
      <div className="col-span-2">
        <h3 className="mb-5 w-full text-left text-lg font-bold">UCI Number</h3>
        <Textfield
          register={register}
          name="UCINumber"
          placeholder="123456"
          defaultValue={data?.UCINumber}
        />
      </div>
      <div className="col-span-2">
        <span className="align-center flex w-full justify-between">
          <h3 className="mb-5 text-left text-lg font-bold">Documents</h3>
          <button
            className="flex w-fit cursor-pointer gap-2"
            onClick={(e) => {
              e.preventDefault();
              setModalOpen(true);
            }}
          >
            <label htmlFor="image_upload" className="grid cursor-pointer">
              <div className="flex gap-3">
                <span>
                  <Image src="/plus.svg" alt="Plus icon" aria-hidden width="20" height="20" />
                </span>
                Add Document
              </div>
            </label>
          </button>
        </span>
        <ul className="flex flex-wrap gap-3">
          {studentDocuments?.map((document) => (
            <Fragment key={document.name}>
              <Popover>
                <PopoverTrigger asChild>
                  <li
                    className="rounded-4 w-fit cursor-pointer rounded-md border-[1px] border-solid border-[#929292] bg-[#ececec] px-4 py-2"
                    title={document.name}
                  >
                    <TruncateDocument
                      documentName={document.name}
                      documentLength={studentDocuments.length}
                    />
                  </li>
                </PopoverTrigger>
                <PopoverContent className="grid w-auto p-0">
                  {document.link && (
                    <button
                      onClick={() => {
                        window.open(document.link, "_blank");
                      }}
                      className="rounded-tl-md rounded-tr-md border-[1px] border-solid border-black bg-white px-10 py-4"
                    >
                      View File
                    </button>
                  )}

                  <ModalConfirmation
                    icon={<GreenQuestionIcon />}
                    triggerElement={
                      <button
                        className={`${!document.link && "rounded-tl-md rounded-tr-md border-t-[1px]"} border-[1px] border-b-0 border-t-0 border-solid border-black bg-white px-10 py-4 text-pia_dark_green`}
                      >
                        {document.markedAdmin ? "Unmark" : "Mark"} Admin
                      </button>
                    }
                    title={document.markedAdmin ? "Unmark admin?" : "Mark admin only?"}
                    description={`${document.markedAdmin ? "Everyone will be able to" : "Only admin will"} see these files`}
                    confirmText={document.markedAdmin ? "Unmark" : "Mark"}
                    kind="primary"
                    onConfirmClick={() => {
                      handleMarkAdmin(document);
                      setDidDeleteOrMark(true);
                    }}
                  />
                  <ModalConfirmation
                    icon={<RedDeleteIcon />}
                    triggerElement={
                      <button className="rounded-bl-md rounded-br-md border-[1px] border-solid border-black bg-white px-10 py-4 text-destructive">
                        Delete File
                      </button>
                    }
                    title="Are you sure you want to delete?"
                    confirmText="Delete"
                    kind="destructive"
                    onConfirmClick={() => {
                      handleDeleteDocument(document);
                      setDidDeleteOrMark(true);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Fragment>
          ))}
        </ul>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className={"max-h-[70%] max-w-[80%] rounded-[8px] p-5 md:max-w-[65%] lg:max-w-[40%]"}
        >
          <div
            ref={dropZoneRef}
            className={`grid place-items-center gap-4 px-[40px] py-[30px]  ${styles.document_dropzone}`}
            onDrop={(event) => {
              dropHandler(event, handleImageUpload);
              setIsDragging(false);
            }}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
              if (dropZoneRef.current?.contains(event.relatedTarget as Node)) {
                setIsDragging(true);
              }
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              if (!dropZoneRef.current?.contains(event.relatedTarget as Node)) {
                setIsDragging(false);
              }
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23${isDragging ? "006867" : "c4c3c2"}' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
              borderRadius: "12px",
              backgroundColor: isDragging ? "#f0f0f0" : "white",
            }}
          >
            <button
              className="ml-auto"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              <CloseIcon />
            </button>

            <Image src="/icons/plant.svg" width={49} height={64} alt="Plant Icon" aria-hidden />
            <h3 className="text-center text-lg font-bold">Select a file or drag and drop here</h3>
            <p className="text-center opacity-40">JPG, PNG or PDF, file size no more than 10MB</p>

            {modalFiles.length > 0 && (
              <ul className="flex flex-wrap gap-3">
                {modalFiles.map((document) => (
                  <li
                    key={document.name}
                    onClick={() => {
                      setModalFiles((prev) => prev.filter((file) => file.name !== document.name));
                    }}
                    title={document.name}
                    className="rounded-4 flex w-fit cursor-pointer items-center gap-3 rounded-md border-[1px] border-solid border-[#929292] bg-[#ececec] px-4 py-2"
                  >
                    <TruncateDocument
                      documentName={document.name}
                      documentLength={currentFiles.length}
                    />
                    <span>
                      <CloseIcon />
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {modalFiles.length > 0 ? (
              <div className="flex w-full justify-between">
                <div>
                  <Button
                    onClick={() => fileUploadRef.current?.click()}
                    label="Select File"
                    kind="secondary"
                  />
                  <input
                    onChange={(e) => {
                      handleImageUpload(e.target.files ? Array.from(e.target.files) : null);
                    }}
                    ref={fileUploadRef}
                    className="hidden"
                    type="file"
                    accept={SUPPORTED_FILETYPES.join(",")}
                    multiple
                  ></input>
                </div>
                <SaveCancelButtons
                  className="mt-0"
                  setOpen={setOpenSaveCancel}
                  onCancelClick={() => {
                    setModalFiles([]);
                  }}
                  onSaveClick={uploadDocument}
                  primaryLabel="Upload"
                />
              </div>
            ) : (
              <div className="mx-auto">
                <Button
                  onClick={() => fileUploadRef.current?.click()}
                  label="Select File"
                  kind="secondary"
                />
                <input
                  onChange={(e) => {
                    handleImageUpload(e.target.files ? Array.from(e.target.files) : null);
                  }}
                  ref={fileUploadRef}
                  className="hidden"
                  type="file"
                  accept={SUPPORTED_FILETYPES.join(",")}
                  multiple
                ></input>
              </div>
            )}
            <p
              className={`flex items-center text-sm text-red-500 ${documentError ? "opacity-100" : "opacity-0"}`}
            >
              <span>
                <AlertCircle className="mr-1 w-[1.5em]" aria-hidden="true" />
              </span>
              {documentError}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
