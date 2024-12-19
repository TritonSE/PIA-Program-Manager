import { useRouter } from "next/router";

import Calendar from "@/components/Calendar/Calendar";
import CalendarTable from "@/components/CalendarTable/CalendarTable";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Component() {
  useRedirectToLoginIfNotSignedIn();

  const router = useRouter();
  const { student, program } = router.query;

  if (!student || !program) return <CalendarTable />;

  return <Calendar studentId={student as string} programId={program as string} />;
}
