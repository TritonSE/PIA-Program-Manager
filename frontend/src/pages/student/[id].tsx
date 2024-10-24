import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import StudentProfile from "@/components/StudentProfile";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Student() {
  useRedirectToLoginIfNotSignedIn();
  const router = useRouter();
  const [studentID, setStudentID] = useState<string>();

  useEffect(() => {
    const id = router.query.id as string;
    setStudentID(id);
  });

  return (
    <div>
      <StudentProfile id={studentID ? studentID : "loading"}></StudentProfile>
    </div>
  );
}
