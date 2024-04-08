import StudentsTable from "../components/StudentsTable/StudentsTable";

import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Home() {
  useRedirectToLoginIfNotSignedIn();
  return <StudentsTable />;
}
