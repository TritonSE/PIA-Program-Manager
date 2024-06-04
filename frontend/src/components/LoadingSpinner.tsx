import Image from "next/image";

import loadingSpinner from "../../public/loading-spinner.png";
import styles from "../styles/LoadingSpinner.module.css";

export default function LoadingSpinner() {
  return (
    <div className="grid h-[80vh] w-full place-items-center">
      <div>
        <Image
          className={styles.spinner}
          src={loadingSpinner}
          alt="Loading Spinner"
          width={80}
          height={80}
          priority
        />
        <p className="mt-5 text-center text-pia_dark_green">Loading...</p>
      </div>
    </div>
  );
}
