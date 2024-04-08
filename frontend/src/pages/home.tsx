import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";
import StudentsTable from "../components/StudentsTable/StudentsTable";

export default function Home() {
  useRedirectToLoginIfNotSignedIn();
  return <StudentsTable />;
}
