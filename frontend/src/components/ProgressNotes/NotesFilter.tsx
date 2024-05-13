import SearchIcon from "../../../public/icons/search.svg";
import DebouncedInput from "../DebouncedInput";
import { ProgramFilter } from "../StudentsTable/FilterFns";

type NotesFilterProps = {
  handleFilterQuery: (query: string) => void;
  handleSelectProgram: (programId: string) => void;
  mobileView: "studentList" | "studentDetails";
};

export default function NotesFilter({
  handleFilterQuery,
  handleSelectProgram,
  mobileView,
}: NotesFilterProps) {
  return (
    <>
      {mobileView === "studentList" ? (
        <div className="flex flex-col gap-5 sm:flex-row">
          {/* Subtract by 12px to account for padding */}
          <ProgramFilter
            setValue={handleSelectProgram}
            className="w-full bg-white sm:w-[calc(60%-12px)] xl:w-[calc(40%-12px)]"
          />
          <DebouncedInput
            icon={<SearchIcon width={20} height={20} />}
            initialValue=""
            onChange={(val) => {
              handleFilterQuery(val);
            }}
            className="mb-5 w-full bg-white "
            placeholder="Search Students or Notes"
          />
        </div>
      ) : null}
    </>
  );
}
