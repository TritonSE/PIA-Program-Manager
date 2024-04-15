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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedOption && setDropdownValue) {
      setDropdownValue(name, selectedOption as PathValue<T, Path<T>>);
    }
  }, [selectedOption]);

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
        <span className="text-neutral-400">{label + ": "}</span>
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
        {options.map((option) => (
          <DropdownMenuItem
            className="h-10 w-[244px] hover:bg-pia_primary_light_green"
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
