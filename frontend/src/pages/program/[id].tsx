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
    return (
      <div>
        <p>{program.name}</p>
        <p>test</p>
      </div>
    );
  } else {
    // Replace with Loading Gif once it is created
    return <p>loading</p>;
  }
}
