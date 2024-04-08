import { ProgramData } from "../components/ProgramForm/types";
import ProgramFormButton from "../components/ProgramFormButton";
import sampleProgramData from "../sampleProgramData.json";

export default function Programs() {
  console.log(sampleProgramData);
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
