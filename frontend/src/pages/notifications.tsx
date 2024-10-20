import { useContext, useEffect, useState } from "react";

import LoadingSpinner from "@/components/LoadingSpinner";
import NotificationTable from "@/components/NotificationCard/NotificationTable";
import { UserContext } from "@/contexts/user";
import { useRedirectTo404IfNotAdmin, useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Notifications() {
  useRedirectToLoginIfNotSignedIn();
  useRedirectTo404IfNotAdmin();

  const { piaUser, firebaseUser } = useContext(UserContext);
  const [firebaseToken, setFirebaseToken] = useState("");

  useEffect(() => {
    if (!piaUser || !firebaseUser) return;

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
  }, [piaUser, firebaseUser, firebaseToken]);

  return (
    <main>
      <div className="space-y-[20px]">
        <div className="font-[alternate-gothic] text-2xl lg:text-4xl">Notifications</div>
        <div className="font-[Poppins] text-[16px]">
          Review information of new account creations below to approve or deny them.{" "}
        </div>
        {!piaUser || !firebaseUser ? (
          <LoadingSpinner />
        ) : (
          <NotificationTable firebaseToken={firebaseToken} />
        )}
      </div>
    </main>
  );
}
