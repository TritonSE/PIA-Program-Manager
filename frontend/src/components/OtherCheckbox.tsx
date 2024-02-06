import { useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";

import { FormData } from "./StudentForm/types";
import { Textfield } from "./Textfield";

type OtherCheckboxProps = {
  register: UseFormRegister<FormData>;
  defaultOtherValue?: string;
};

export default function OtherCheckbox({ register, defaultOtherValue = "" }: OtherCheckboxProps) {
  const [checked, setChecked] = useState(defaultOtherValue !== "");

  //Revert other checkbox when clicked outside
  useEffect(() => {
    if (checked) {
      const otherInput = document.getElementById("OtherType Here...") as HTMLInputElement;
      const handleOutsideClick = (e: MouseEvent) => {
        if (!otherInput?.contains(e.target as Node) && otherInput?.value === "") {
          setChecked(false);
          document.removeEventListener("click", handleOutsideClick);
        }
      };
      setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
      }, 0);
    }
  }, [checked]);

  return checked ? (
    <Textfield
      className="animate-in fade-in"
      register={register}
      name="other"
      label="Other"
      placeholder="Type Here..."
      defaultValue={defaultOtherValue}
    />
  ) : (
    <div className="flex content-center justify-between ">
      <label
        className="justify-left grid flex-1 select-none content-center py-[15px] hover:cursor-pointer"
        htmlFor={"Othercheckbox"}
      >
        {"Other"}
      </label>
      <input
        id={"Othercheckbox"}
        className="h-[40px] w-[40px] appearance-none self-center rounded-[10px] bg-[#D9D9D9] checked:bg-pia_dark_green hover:cursor-pointer"
        type="checkbox"
        onChange={() => {
          setChecked(true);
        }}
      />
    </div>
  );
}
