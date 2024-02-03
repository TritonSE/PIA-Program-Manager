import StudentFormButton from "../components/StudentFormButton";
import sampleStudentData from "../sampleStudentData.json";

export default function Home() {
  return (
    <div className="grid w-40 gap-5">
      <StudentFormButton type="edit" data={sampleStudentData} />
      <StudentFormButton type="add" />
    </div>
  );
}
