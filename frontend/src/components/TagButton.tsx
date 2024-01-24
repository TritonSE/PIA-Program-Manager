import { Poppins } from "next/font/google";
import React from "react";

import styles from "../styles/TagButton.module.css";

type TagButtonStyles = {
  button: string;
  tagButton: string;
  disabled: string;
};

const poppins = Poppins({ weight: "400", style: "normal", subsets: [] });

export type TagButtonProps = {
  label: string;
  disabled?: boolean;
} & React.ComponentProps<"button">;

export const TagButton = React.forwardRef<HTMLButtonElement, TagButtonProps>(function TagButton(
  { label, disabled = false, className, ...props }: TagButtonProps,
  ref,
) {
  const tagButtonStyles: TagButtonStyles = styles as TagButtonStyles;

  let buttonClass = tagButtonStyles.button;

  // disabled buttons have different styling
  if (disabled) {
    buttonClass += ` ${tagButtonStyles.disabled}`;
  } else {
    buttonClass += ` ${tagButtonStyles.tagButton}`;
  }

  // Lets developers apply their own styling
  if (className) {
    buttonClass += ` ${className}`;
  }

  // Set font to Poppins
  buttonClass += ` ${poppins.className}`;

  return (
    <button ref={ref} disabled={disabled} className={buttonClass} {...props}>
      {label}
    </button>
  );
});
