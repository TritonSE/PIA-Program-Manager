import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Textfield } from "./Textfield";

const DebouncedInput = ({
  initialValue = "",
  onChange,
  debounce = 500,
  placeholder = "",
  icon,
  className,
}: {
  initialValue?: string;
  onChange: (val: string) => void;
  debounce?: number;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
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
      className={className}
      register={register}
      name="debounced_input"
      placeholder={placeholder}
      handleInputChange={(e) => {
        setValue(e.target.value);
      }}
      icon={icon}
    />
  );
};

export default DebouncedInput;
