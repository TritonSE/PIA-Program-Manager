import Image from "next/image";
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
  initialValue?: string;
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
  options, // list of options - should be memoized
  onChange = () => void 0,
  defaultValue, // value if you want a permanent default label that is not really a value (see home page dropdowns)
  initialValue, // value if you want a default value that is a value in the list of options (see create/edit student dropdowns)
  className,
}: DropdownProps<T>) {
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue ?? initialValue ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedOption && setDropdownValue) {
      setDropdownValue(name, selectedOption as PathValue<T, Path<T>>);
    }
  }, [selectedOption]);

  // clear out value if we get a new set of options
  useEffect(() => {
    setSelectedOption(defaultValue ?? initialValue ?? "");
  }, [options]);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <DropdownMenuTrigger
        className={cn(
          "relative inline-flex h-[46px] w-[244px] items-center justify-start gap-2 rounded-sm border border-pia_border px-4 py-3 outline-none",
          className,
        )}
      >
        {label && <span className="text-neutral-400">{label + ": "}</span>}
        <span className="text-neutral-800">{selectedOption ?? ""}</span>
        <Image
          src="/ic_round-arrow-drop-up.svg"
          width={40}
          height={40}
          alt="dropdown toggle"
          className="absolute right-0 transition-transform"
          style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)" }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {defaultValue && (
          <DropdownMenuItem
            className="h-10 w-[244px] hover:bg-pia_primary_light_green"
            key={""}
            onSelect={() => {
              onChange("");
              setSelectedOption(defaultValue);
            }}
          >
            {defaultValue}
          </DropdownMenuItem>
        )}
        {options.map((option, i) => (
          <DropdownMenuItem
            className="h-10 w-[244px] hover:bg-pia_primary_light_green"
            key={i}
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
