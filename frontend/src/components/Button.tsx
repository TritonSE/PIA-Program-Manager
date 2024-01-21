import { Poppins } from "next/font/google";
import React from "react";

import styles from "../styles/Button.module.css";

type ButtonStyles = {
  button: string;
  disabled: string;
  secondary: string;
  destructive: string;
  destructiveSecondary: string;
  primary: string;
  small: string;
  default: string;
};

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
  const buttonStyles: ButtonStyles = styles as ButtonStyles;

  let buttonClass = buttonStyles.button;

  // All disabled buttons have same style, so we can ignore kind
  if (disabled) {
    buttonClass += ` ${buttonStyles.disabled}`;
  }

  // If not disabled, assign style based on kind
  else {
    switch (kind) {
      case "secondary":
        buttonClass += ` ${buttonStyles.secondary}`;
        break;
      case "destructive":
        buttonClass += ` ${buttonStyles.destructive}`;
        break;
      case "destructive-secondary":
        buttonClass += ` ${buttonStyles.destructiveSecondary}`;
        break;
      default:
        buttonClass += ` ${buttonStyles.primary}`;
    }
  }

  // button size styling depends on size
  switch (size) {
    case "small":
      buttonClass += ` ${buttonStyles.small}`;
      break;
    default:
      buttonClass += ` ${buttonStyles.default}`;
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
