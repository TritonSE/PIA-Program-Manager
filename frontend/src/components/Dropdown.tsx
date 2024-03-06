import { useEffect, useState } from "react";
import { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown";

import { cn } from "@/lib/utils";

type BaseProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder: string;
  defaultValue?: string;
  className?: string;
};

type DropdownProps<T extends FieldValues> = BaseProps<T> & {
  options: string[];
  setDropdownValue?: UseFormSetValue<T>;
  onChange?: (val: string) => void;
};

export function Dropdown<T extends FieldValues>({
  setDropdownValue,
  label,
  name,
  options,
  onChange = () => void 0,
  defaultValue = "",
  className,
}: DropdownProps<T>) {
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue);

  useEffect(() => {
    if (selectedOption && setDropdownValue) {
      setDropdownValue(name, selectedOption as PathValue<T, Path<T>>);
    }
  }, [selectedOption]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-[46px] w-[244px] items-start justify-start gap-2 rounded-sm border border-pia_border px-4 py-3",
          className,
        )}
      >
        <span className="text-neutral-400">{label + ": "}</span>
        <span className="text-neutral-800">{selectedOption ?? ""}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="h-10 w-[244px] hover:bg-slate-100"
          key={""}
          onSelect={() => {
            onChange("");
            setSelectedOption(defaultValue);
          }}
        >
          {defaultValue}
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            className="h-10 w-[244px] hover:bg-slate-100"
            key={option}
            onSelect={() => {
              onChange(option);
              setSelectedOption(option);
            }}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
