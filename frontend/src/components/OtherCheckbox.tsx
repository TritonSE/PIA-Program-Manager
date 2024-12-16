import { useEffect, useState } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

import { Textfield } from "./Textfield";

type OtherCheckboxProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  defaultOtherValue?: string;
};

export default function OtherCheckbox<T extends FieldValues>({
  register,
  defaultOtherValue = "",
}: OtherCheckboxProps<T>) {
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

  return checked || defaultOtherValue ? (
    <Textfield
      className="animate-in fade-in"
      register={register}
      name={"dietaryOther" as Path<T>}
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
        className="peer h-[40px] w-[40px]  appearance-none rounded-[5px] border-[1px] border-black bg-white transition-colors hover:cursor-pointer hover:bg-[#00686766] focus-visible:bg-[#00686766]"
        type="checkbox"
        onChange={() => {
          setChecked(true);
        }}
      />
    </div>
  );
}
