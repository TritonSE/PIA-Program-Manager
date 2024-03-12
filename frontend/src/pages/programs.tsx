import ProgramFormButton from "../components/ProgramFormButton";
import StudentFormButton from "../components/StudentFormButton";

export default function Programs() {
  return (
    <div>
      <div className="w-40">
        <ProgramFormButton type="add" />{" "}
      </div>
      <div className="w-40">
        <StudentFormButton type="add" />
      </div>
    </div>
  );
}
