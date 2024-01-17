import React, { RefObject, useState } from "react";

import { Textfield } from "./Textfield";

type OtherCheckboxProps = {
  innerRef: RefObject<HTMLInputElement>;
};

export default function OtherCheckbox({ innerRef }: OtherCheckboxProps) {
  const [checked, setChecked] = useState(false);

  return checked ? (
    <Textfield label="Other" placeholder="Type Here..." innerRef={innerRef} />
  ) : (
    <div className="flex justify-between content-center">
      <label
        className="justify-left grid flex-1 content-center select-none py-[15px]"
        htmlFor={"Othercheckbox"}
      >
        {"Other"}
      </label>
      <input
        id={"Othercheckbox"}
        className="checked:bg-pia_dark_green h-[40px] self-center w-[40px] appearance-none rounded-[10px] bg-[#D9D9D9]"
        type="checkbox"
        onChange={() => {
          setChecked(true);
        }}
      />
    </div>
  );
}
