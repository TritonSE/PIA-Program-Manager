import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { ProgramProfile } from "../../components/ProgramProfile";
import { useWindowSize } from "../../hooks/useWindowSize";

export default function Component() {
  const { windowSize } = useWindowSize();
  const isTablet = useMemo(() => windowSize.width < 1024, [windowSize.width]);

  const router = useRouter();

  const [programId, setProgramId] = useState<string>();

  useEffect(() => {
    const { id } = router.query;
    if (typeof id === "string") {
      setProgramId(id);
    }
  });

  let mainClass = "bg-white overflow-hidden";
  let backIconClass = "";

  if (isTablet) {
    mainClass += " fixed top-0 left-0 w-full h-full pt-10";
    backIconClass += " fixed top-12 left-2";
  } else {
    mainClass += " h-full rounded-xl border-black border-2";
  }

  if (typeof programId !== "undefined") {
    return (
      <main className={mainClass}>
        {isTablet && (
          <Link href="/programs">
            <Image
              alt="back"
              src="/programs/BackArrow.png"
              height={24}
              width={24}
              className={backIconClass}
            />
          </Link>
        )}
        <ProgramProfile id={programId} />
      </main>
    );
  }
}
