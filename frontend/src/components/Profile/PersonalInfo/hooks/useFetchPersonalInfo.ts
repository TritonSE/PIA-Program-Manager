import { useEffect, useState } from "react";

import { getPhoto } from "@/api/user";
import { UserData } from "@/pages/profile";

export const useFetchPersonalInfo = (userData: UserData) => {
  const { piaUser, firebaseUser } = userData;
  const [loading, setLoading] = useState(true);
  const [basicInfoData, setBasicInfoData] = useState({ name: "", image: "" });
  const [contactInfoData, setContactInfoData] = useState({ email: "" });
  const [passwordData, setPasswordData] = useState({ last_changed: null as Date | null });
  const [firebaseToken, setFirebaseToken] = useState("");
  const [currentImageId, setCurrentImageId] = useState("default");

  useEffect(() => {
    if (!piaUser || !firebaseUser) return;
    if (piaUser && firebaseUser) setLoading(false);

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
    if (piaUser.profilePicture === "default") {
      setBasicInfoData((prev) => ({ ...prev, image: "default" }));
    } else if (piaUser.profilePicture && firebaseToken) {
      setCurrentImageId(piaUser.profilePicture);
      getPhoto(piaUser.profilePicture, firebaseToken).then(
        (result) => {
          if (result.success) {
            const newImage = result.data;
            setBasicInfoData((prev) => ({ ...prev, image: newImage }));
          } else {
            console.error(result.error);
          }
        },
        (error) => {
          console.error(error);
        },
      );
    }
    if (piaUser.name) {
      setBasicInfoData((prev) => ({ ...prev, name: piaUser.name }));
    }
    if (piaUser.email) {
      setContactInfoData((prev) => ({ ...prev, email: piaUser.email }));
    }
    if (piaUser.lastChangedPassword) {
      setPasswordData((prev) => ({ ...prev, last_changed: piaUser.lastChangedPassword }));
    }
  }, [piaUser, firebaseUser, firebaseToken]);

  return {
    loading,
    basicInfoData,
    setBasicInfoData,
    contactInfoData,
    setContactInfoData,
    passwordData,
    setPasswordData,
    firebaseToken,
    currentImageId,
    setCurrentImageId,
  };
};
