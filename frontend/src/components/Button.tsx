import { Poppins } from "next/font/google";
import React from "react";

import styles from "../styles/Button.module.css";

const poppins = Poppins({ weight: "400", style: "normal", subsets: [] });

export type ButtonProps = {
  label: string;
  kind?: "primary" | "secondary" | "destructive" | "destructive-secondary";
  size?: "default" | "small";
  disabled?: boolean;
} & React.ComponentProps<"button">;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { label, kind = "primary", size = "default", disabled = false, className, ...props }: ButtonProps,
  ref,
) {
  let buttonClass = styles.button;

  // All disabled buttons have same style, so we can ignore kind
  if (disabled) {
    buttonClass += ` ${styles.disabled}`;
  }

  // If not disabled, assign style based on kind
  else {
    switch (kind) {
      case "secondary":
        buttonClass += ` ${styles.secondary}`;
        break;
      case "destructive":
        buttonClass += ` ${styles.destructive}`;
        break;
      case "destructive-secondary":
        buttonClass += ` ${styles.destructiveSecondary}`;
        break;
      default:
        buttonClass += ` ${styles.primary}`;
    }
  }

  // button size styling depends on size
  switch (size) {
    case "small":
      buttonClass += ` ${styles.small}`;
      break;
    default:
      buttonClass += ` ${styles.default}`;
      break;
  }

  // Lets developers apply their own styling
  if (className) {
    buttonClass += ` ${className}`;
  }

  // Set font to poppins
  buttonClass += ` ${poppins.className}`;

  return (
    <button ref={ref} className={buttonClass} {...props}>
      {label}
    </button>
  );
});
