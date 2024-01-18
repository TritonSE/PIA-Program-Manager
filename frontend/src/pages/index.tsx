import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Checkbox } from "../components/Checkbox";
import Radio from "../components/Radio";
import { Textfield } from "../components/Textfield";

export default function Home() {
  const dietaryList = ["Nuts", "Eggs", "Seafood", "Pollen", "Dairy", "Other"];

  const { register, setValue, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-10 min-h-screen flex-col items-center justify-between p-12"
    >
      <div className="grid gap-5">
        <Textfield register={register} name={"firstname"} label="First" placeholder="John" />
        <Textfield
          register={register}
          name={"email"}
          label={"Email"}
          type="email"
          placeholder="johnsmith@gmail.com"
        />
        <Textfield
          register={register}
          setValue={setValue}
          name={"date"}
          label="Date"
          placeholder="00/00/0000"
          calendar={true}
        />
      </div>

      <div className="grid w-full sm:w-1/2 ">
        <h2 className="text-pia_accent mb-2">Dietary Restrictions</h2>
        <Checkbox register={register} name="dietary" options={dietaryList} />
      </div>

      <div className="">
        <h2 className="mb-5 font-bold text-2xl">Gender</h2>
        <Radio register={register} name="gender" options={["Male", "Female", "Rather not say"]} />
      </div>

      <button type="submit" className="bg-pia_dark_green text-white px-5 py-3 rounded-md">
        Submit
      </button>
    </form>
  );
}
