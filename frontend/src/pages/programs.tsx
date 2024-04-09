import { ProgramData } from "../components/ProgramForm/types";
import ProgramFormButton from "../components/ProgramFormButton";
import sampleProgramData from "../sampleProgramData.json";

//import { useRedirectTo404IfNotAdmin, useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Programs() {
  //useRedirectToLoginIfNotSignedIn();
  //useRedirectTo404IfNotAdmin();
  return (
    <div>
      <div className="w-40">
        <ProgramFormButton type="add" />{" "}
      </div>
      <div className="w-40">
        <ProgramFormButton type="edit" data={sampleProgramData as ProgramData} />{" "}
      </div>
    </div>
  );
}
