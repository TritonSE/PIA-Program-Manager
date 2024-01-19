import { Poppins } from "next/font/google";
import React from "react";

import styles from "../styles/TagButton.module.css";

const poppins = Poppins({ weight: "400", style: "normal", subsets: [] });

export type TagButtonProps = {
  label: string;
  disabled?: boolean;
} & React.ComponentProps<"button">;

export const TagButton = React.forwardRef<HTMLButtonElement, TagButtonProps>(function TagButton(
  { label, disabled = false, className, ...props }: TagButtonProps,
  ref,
) {
  let buttonClass = styles.button;

  // disabled buttons have different styling
  if (disabled) {
    buttonClass += ` ${styles.disabled}`;
  } else {
    buttonClass += ` ${styles.tagButton}`;
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
