import Link from "next/link";

import NoStudentsIcon from "../../public/noStudents.svg";

export default function NoStudents() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <NoStudentsIcon className="mb-5" />
      <h2 className="pb-2 text-2xl text-neutral-500">No Students</h2>
      <Link href="/home">
        <span className="underline">Add a student</span> to continue
      </Link>
    </div>
  );
}
