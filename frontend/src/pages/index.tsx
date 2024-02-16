import { useForm } from "react-hook-form";

import { Button } from "../components/Button";
import { Checkbox } from "../components/Checkbox";
import ProgramForm from "../components/ProgramForm";
import StudentFormButton from "../components/StudentFormButton";
import { Textfield } from "../components/Textfield";
import sampleProgramData from "../sampleProgramData.json";
import sampleStudentData from "../sampleStudentData.json";

type FruitData = {
  fruits: string[];
  favoriteFruit: string;
};

export default function Home() {
  const { register, handleSubmit, reset } = useForm<FruitData>();

  const onSubmit = (formData: FruitData) => {
    console.log(formData);
    reset();
  };

  return (
    <div className="w-1/2">
      <div className="flex gap-5">
        <StudentFormButton type="edit" data={sampleStudentData} />
        <StudentFormButton type="add" />
      </div>
      <div>
        <ProgramForm type="edit" data={sampleProgramData}/>
        <ProgramForm type="add"/>
      </div>

      {/* Example */}
      <div className="mt-5">
        <h2 className="text-2xl font-bold">Example</h2>
        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <Checkbox name="fruits" register={register} options={["apples", "oranges", "bananas"]} />
          <Textfield name="favoriteFruit" register={register} placeholder="Favorite Fruit" />
          <Button label="Submit" />
        </form>
      </div>
    </div>
  );
}
