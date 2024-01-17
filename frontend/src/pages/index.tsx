import { useRef, useState } from "react";

import { Checkbox } from "../components/Checkbox";
import Radio from "../components/Radio";
import { Textfield } from "../components/Textfield";

export default function Home() {
  // Textfield Component
  const dateRef = useRef<HTMLInputElement>(null);
  const firstnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  //Checkbox Component
  const dietaryList = ["Nuts", "Eggs", "Seafood", "Pollen", "Dairy", "Other"];
  const [dietaryRestrictions, setDietaryRestriction] = useState<string[]>([]);
  const otherRef = useRef<HTMLInputElement>(null);

  //Radio Component
  const [gender, setGender] = useState<string>("");

  function handleSubmit() {
    console.log("Date:", dateRef.current?.value);
    console.log("First name: ", firstnameRef.current?.value);
    console.log("Email: ", emailRef.current?.value);
    console.log("Dietary Restrictions: ", dietaryRestrictions);
    console.log("Dietary Restrictions Other: ", otherRef.current?.value);
    console.log("Gender: ", gender);
  }

  return (
    <main className="flex gap-5 min-h-screen flex-col items-center justify-between p-24">
      <div className="grid gap-5">
        <Textfield innerRef={dateRef} label="Date" placeholder="00/00/0000" calendar={true} />
        <Textfield
          innerRef={firstnameRef}
          label="First"
          placeholder="John"
          className="border-blue-500"
        />
        <Textfield innerRef={emailRef} placeholder="Email" />
      </div>

      <div className="grid w-full sm:w-1/2 ">
        <h2 className="text-pia_accent mb-2">Dietary Restrictions</h2>
        <Checkbox
          options={dietaryList}
          otherRef={otherRef}
          state={dietaryRestrictions}
          setState={setDietaryRestriction}
        />
      </div>

      <div className="">
        <h2 className="mb-5 font-bold text-2xl">Gender</h2>
        <Radio setState={setGender} options={["Male", "Female", "Rather not say"]} />
      </div>

      <button onClick={handleSubmit} className="bg-pia_dark_green text-white px-5 py-3 rounded-md">
        Submit
      </button>
    </main>
  );
}
