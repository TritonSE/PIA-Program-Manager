import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  placeholder,
  name,
  options, // list of options - should be memoized
  onChange = () => void 0,
  defaultValue, // value if you want a permanent default label that is not really a value (see home page dropdowns)
  initialValue, // value if you want a default value that is a value in the list of options (see create/edit student dropdowns)
  className,
}: DropdownProps<T>) {
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue ?? initialValue ?? "");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedOption && setDropdownValue) {
      setDropdownValue(name, selectedOption as PathValue<T, Path<T>>);
    }
  }, [selectedOption]);

  const menuItemStyle = `cursor-pointer py-6 h-10 w-[240px] before:absolute before:bottom-0 before:h-[1px] before:w-full before:bg-[#B4B4B4] before:content-[''] 
    hover:bg-pia_primary_light_green
    ${triggerRef.current ? `w-[${triggerRef.current.clientWidth}px]` : `w-[240px]`}`;

  return (
    <DropdownMenu
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <DropdownMenuTrigger
        ref={triggerRef}
        className={cn(
          "relative inline-flex h-[46px] w-[244px] items-center justify-start gap-2 rounded-sm border border-pia_border bg-white px-4 py-3 ",
          className,
        )}
      >
        <span className={`text-neutral-${selectedOption ? 800 : 400}`}>
          {selectedOption ? selectedOption : placeholder}
        </span>
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
            className={menuItemStyle}
            style={triggerRef.current ? { width: `${triggerRef.current.clientWidth}px` } : {}}
            key={""}
            onSelect={() => {
              onChange("");
              setSelectedOption(defaultValue);
            }}
          >
            <span className="px-3">{defaultValue}</span>
          </DropdownMenuItem>
        )}
        {options.map((option) => (
          <DropdownMenuItem
            className={menuItemStyle}
            key={option}
            onSelect={() => {
              onChange(option);
              setSelectedOption(option);
            }}
          >
            <span className="px-3">{option}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
