import React, { useEffect, useState } from "react";
import { getNotApprovedUsers, User } from "@/api/user"; 
import NotificationCard from "./NotificationCard";

export default function NotificationTable() {
  const [notApprovedUsers, setNotApprovedUsers] = useState<User[]>([]);


  useEffect(() => {
    const fetchNotApprovedUsers = async () => {
      try {
        const result = await getNotApprovedUsers();
        if (result.success) {
          setNotApprovedUsers(result.data);
        } else {
          console.error("Failed to fetch not-approved users:", result.error);
        }
      } catch (error) {
        console.error("Error fetching not-approved users:", error);
      }
    };

    fetchNotApprovedUsers();
  }, []);

  return (
    <div className="m-auto max-w-full border-collapse border-separate rounded-[15px] border-[1px] border-pia_neutral_gray bg-pia_primary_white">
      {notApprovedUsers.map((user) => (
        <div key={user.uid}>
          <NotificationCard
            name={user.name}
            email={user.email}
            account_type={user.role}
          />
        </div>
      ))}
    </div>
  );

  

}
