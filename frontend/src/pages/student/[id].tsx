import StudentProfile from "@/components/StudentProfile";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Student() {
  useRedirectToLoginIfNotSignedIn();

  return (
    <div>
      <StudentProfile></StudentProfile>
    </div>
  );
}
