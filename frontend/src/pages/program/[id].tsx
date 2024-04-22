import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Program, getProgram } from "../../api/programs";

export default function Component() {
  const router = useRouter();

  const [program, setProgram] = useState<Program>();

  useEffect(() => {
    const { id } = router.query;
    if (id === undefined) {
      return;
    }
    getProgram(id as string).then(
      (result) => {
        if (result.success) {
          setProgram(result.data);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  });

  if (typeof program !== "undefined") {
    return <p>{program.name}</p>;
  } else {
    return <p>loading</p>;
  }
}
