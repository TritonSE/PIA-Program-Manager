import { useState } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

import { Textfield } from "./Textfield";

type OtherCheckboxProps = {
  register: UseFormRegister<FieldValues>;
};

export default function OtherCheckbox({ register }: OtherCheckboxProps) {
  const [checked, setChecked] = useState(false);

  return checked ? (
    <Textfield
      className="animate-in fade-in"
      register={register}
      name="other"
      label="Other"
      placeholder="Type Here..."
    />
  ) : (
    <div className="flex justify-between content-center ">
      <label
        className="justify-left grid flex-1 content-center select-none py-[15px] hover:cursor-pointer"
        htmlFor={"Othercheckbox"}
      >
        {"Other"}
      </label>
      <input
        id={"Othercheckbox"}
        className="checked:bg-pia_dark_green h-[40px] self-center w-[40px] appearance-none rounded-[10px] bg-[#D9D9D9] hover:cursor-pointer"
        type="checkbox"
        onChange={() => {
          setChecked(true);
        }}
      />
    </div>
  );
}
