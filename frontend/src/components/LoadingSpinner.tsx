import Image from "next/image";

import loadingSpinner from "../../public/loading-spinner.png";
import styles from "../styles/LoadingSpinner.module.css";

import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  classname?: string;
  label?: string;
  spinnerSize?: number;
};

export default function LoadingSpinner({
  classname,
  label = "Loading...",
  spinnerSize = 80,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("grid h-[80vh] w-full place-items-center", classname)}>
      <div className="grid place-items-center">
        <Image
          className={styles.spinner}
          src={loadingSpinner}
          alt="Loading Spinner"
          width={spinnerSize}
          height={spinnerSize}
          priority
        />
        <p className="mt-5 text-center text-pia_dark_green">{label}</p>
      </div>
    </div>
  );
}
