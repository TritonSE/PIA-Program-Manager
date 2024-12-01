import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Dispatch, SetStateAction } from "react";

import { Document } from "../types";

import { Student } from "@/api/students";
import { editPhoto } from "@/api/user";
import { storage } from "@/firebase/firebase";

type HandleImageDocumentUploadProps = {
  imageDataProp: {
    imageFormData: FormData | null;
    newStudentId: string;
    newImageId: string;
    type: "add" | "edit";
    data: Student | null;
    firebaseToken: string;
  };
  documentDataProp: {
    currentFiles: File[];
    studentId: string;
    type: "add" | "edit";
    studentDocuments: Document[];
    setStudentDocuments: Dispatch<SetStateAction<Document[]>>;
    didDeleteOrMark: boolean;
    previousDocuments: Document[] | undefined;
  };
};

export const useHandleImageDocumentUpload = ({
  imageDataProp,
  documentDataProp,
}: HandleImageDocumentUploadProps) => {
  const handleAddingNewImage = async () => {
    const { imageFormData, newStudentId, newImageId, type, data, firebaseToken } = imageDataProp;
    if (!imageFormData) return "";

    let studentId = newStudentId;
    let uploadType = "new";
    let previousImageId = "default";
    let imageId = newImageId;

    if (type === "edit" && data) {
      studentId = data._id;
      uploadType = "edit";
      previousImageId = data.profilePicture;
      if (previousImageId !== "default") {
        imageId = "";
      }
    }

    const resultImageId = await Promise.resolve(
      editPhoto(
        imageFormData,
        previousImageId,
        studentId,
        "student",
        uploadType,
        imageId,
        firebaseToken,
      )
        .then((result) => {
          if (result.success) {
            console.log("Successfully added photo");
            return result.data;
          } else {
            console.log("Error has occured", result.error);
            return "default";
          }
        })
        .catch((error) => {
          console.error(error);
          return "default";
        }),
    );

    return resultImageId;
  };

  const handleUploadingDocument = async () => {
    const { currentFiles, studentId, type, studentDocuments, setStudentDocuments } =
      documentDataProp;

    const uploadPromises = currentFiles.map(async (file) => {
      const storageRef = ref(storage, `documents/${studentId}/` + file.name);

      return uploadBytes(storageRef, file)
        .then(async (snapshot) => {
          console.log(`Uploaded: ${file.name}`);
          const downloadURL = await getDownloadURL(snapshot.ref);
          return { link: downloadURL, name: file.name, markedAdmin: false };
        })
        .catch((error) => {
          console.error("Error uploading file:", file.name, error);
          throw error;
        });
    });

    // Use Promise.all to wait for all uploads to complete
    let documentData = await Promise.all(uploadPromises);

    if (type === "add") {
      setStudentDocuments(documentData);
    } else {
      const validDocuments = studentDocuments.filter((doc) => {
        return doc.link !== "";
      });
      if (validDocuments.length > 0) {
        documentData = [...validDocuments, ...documentData];
      }

      setStudentDocuments(documentData);
    }

    return documentData;
  };

  const handleDidDeleteOrMark = () => {
    const { studentId, studentDocuments, previousDocuments } = documentDataProp;

    const docsToBeDeleted: string[] = [];
    const newDocumentNames = studentDocuments.map((doc) => doc.name);

    previousDocuments?.forEach((doc) => {
      if (!newDocumentNames.includes(doc.name)) {
        docsToBeDeleted.push(doc.name);
      }

      docsToBeDeleted.forEach((fileName) => {
        const deleteFileRef = ref(storage, `documents/${studentId}/` + fileName);

        deleteObject(deleteFileRef)
          .then(() => {
            console.log(`Deleted: ${fileName}`);
          })
          .catch((error) => {
            console.error("Error deleting file:", fileName, error);
            throw error;
          });
      });
    });
  };

  return { handleAddingNewImage, handleUploadingDocument, handleDidDeleteOrMark };
};
