import React, { useEffect, useState } from "react";

import NotificationCard from "./NotificationCard";

import { User, approveUser, deleteUserByEmail, denyUser, getNotApprovedUsers } from "@/api/user";

type NotificationsProps = {
  firebaseToken: string;
};

export default function NotificationTable({ firebaseToken }: NotificationsProps) {
  const [notApprovedUsers, setNotApprovedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchNotApprovedUsers = async () => {
      try {
        const result = await getNotApprovedUsers(firebaseToken);
        if (result.success) {
          console.log("notApprovedUsers:", result.data);

          setNotApprovedUsers(result.data);
        } else {
          console.error("Failed to fetch not-approved users:", result.error);
        }
      } catch (error) {
        console.error("Error fetching not-approved users:", error);
      }
    };

    fetchNotApprovedUsers().catch((error) => {
      console.error("Error fetching not-approved users:", error);
    });
  }, [firebaseToken]);

  const handleApproveUser = async (email: string) => {
    // Immediately update the UI (remove corresponding Notification Card)
    setNotApprovedUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));

    try {
      const result = await approveUser(email, firebaseToken);
      if (!result.success) {
        console.error("Failed to approve user:", result.error);
      }
    } catch (error) {
      console.error("Error handling user approval:", error);
    }
  };

  const handleDenyUser = async (email: string) => {
    try {
      // Immediately update the UI (remove corresponding Notification Card)
      setNotApprovedUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));

      const denialResult = await denyUser(email, firebaseToken);
      if (!denialResult.success) {
        console.error("Failed to deny user:", denialResult.error);
      }

      // Delete the user from Firebase and MongoDB
      const deletionResult = await deleteUserByEmail(email, firebaseToken);
      if (deletionResult.success) {
        console.log(`User with email ${email} successfully deleted.`);
      } else {
        console.error(`Failed to delete user with email ${email}:`, deletionResult.error);
      }
    } catch (error) {
      console.error("Error handling user denial:", error);
    }
  };

  return (
    <div className="m-auto max-w-full border-collapse border-separate rounded-[15px] border-[1px] border-pia_neutral_gray bg-pia_primary_white">
      {notApprovedUsers.map((user) => (
        <div key={user.uid}>
          <NotificationCard
            name={user.name}
            email={user.email}
            // account_type={user.role}
            account_type={user.accountType} // console log shows correct property name is accountType
            onApprove={() => handleApproveUser(user.email)}
            onDeny={() => handleDenyUser(user.email)}
          />
        </div>
      ))}
    </div>
  );
}
