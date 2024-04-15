import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Textfield } from "./Textfield";

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  placeholder = "",
}: {
  value: string;
  onChange: (val: string) => void;
  debounce?: number;
  placeholder?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = useState(initialValue);
  const { register } = useForm();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  return (
    <Textfield
      register={register}
      name="debounced_input"
      placeholder={placeholder}
      handleInputChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
};

export default DebouncedInput;
