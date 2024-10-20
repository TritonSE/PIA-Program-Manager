import { MouseEventHandler, useState } from "react";
import { useForm } from "react-hook-form";

import { Program, archiveProgram } from "../../api/programs";
import { Button } from "../Button";
import { ProgramMap } from "../StudentsTable/types";
import { Textfield } from "../Textfield";
import { Dialog, DialogClose, DialogContentSlide, DialogTrigger } from "../ui/dialog";

type props = {
  label: string;
};

type archiveProps = {
  setOpenParent: React.Dispatch<React.SetStateAction<boolean>>;
  data: Program;
  isMobile?: boolean;
  setPrograms: React.Dispatch<React.SetStateAction<ProgramMap>>;
  setAlertState: React.Dispatch<React.SetStateAction<{ open: boolean; message: string }>>;
};

function ProgramArchiveHeader({ label }: props) {
  return (
    <div>
      <h2 className="absolute inset-3 mb-4 max-h-[5%] text-2xl font-bold text-neutral-800">
        {label}
      </h2>

      <svg
        className="pl-3"
        width="68"
        height="68"
        viewBox="0 0 68 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M34.0003 55.6337L47.7837 41.8545L44.8337 38.9045L36.0837 47.6545V28.0712H31.917V47.6545L23.167 38.9045L20.217 41.8545L34.0003 55.6337ZM8.04199 67.3337C6.17533 67.3337 4.47949 66.5712 2.95449 65.0462C1.42949 63.5184 0.666992 61.8239 0.666992 59.9628V15.1962C0.666992 14.3823 0.796159 13.6184 1.05449 12.9045C1.3156 12.1878 1.70449 11.5281 2.22116 10.9253L8.71283 3.12533C9.3156 2.31421 10.0698 1.70172 10.9753 1.28783C11.8809 0.873937 12.8531 0.666992 13.892 0.666992H53.9503C54.9892 0.666992 55.9753 0.873937 56.9087 1.28783C57.8392 1.70449 58.6059 2.31699 59.2087 3.12533L65.7795 11.0837C66.2962 11.6864 66.685 12.36 66.9462 13.1045C67.2045 13.8462 67.3337 14.6239 67.3337 15.4378V59.9587C67.3337 61.8198 66.5712 63.5142 65.0462 65.042C63.5184 66.567 61.8239 67.3295 59.9628 67.3295L8.04199 67.3337ZM6.41699 12.367H61.5003L55.9587 5.71699C55.6892 5.44755 55.3809 5.23366 55.0337 5.07533C54.6864 4.91421 54.3253 4.83366 53.9503 4.83366H13.967C13.5948 4.83366 13.2337 4.91421 12.8837 5.07533C12.5392 5.23366 12.2337 5.44755 11.967 5.71699L6.41699 12.367Z"
          fill="#B93B3B"
        />
      </svg>

      <p className="pb-3 pt-4 text-lg font-bold sm:text-2xl">Archive this program?</p>
      <ul className="list-disc pb-3 pl-6 text-sm sm:text-base">
        <li>It will be move to the ‘Archived’ programs tab</li>
        <li>All ‘Joined’ students become ‘Archived’</li>
        <li>You’ll be able to restore this program</li>
      </ul>
    </div>
  );
}

//Currently no functionality, just a button that closes the form
export default function ProgramArchive({
  setOpenParent,
  data,
  isMobile = false,
  setPrograms,
  setAlertState,
}: archiveProps) {
  const [openArchive, setOpenArchive] = useState(false);
  const {
    register: archiveRegister,
    reset: archiveReset,
    setValue: setArchiveCalendarValue,
    getValues: getArchiveValue,
  } = useForm<{ date: string }>();

  const archive: MouseEventHandler = () => {
    const date = new Date(getArchiveValue("date"));
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      archiveProgram(data)
        .then((result) => {
          if (result.success) {
            console.log(result.data);
            archiveReset();
            setOpenArchive(false);
            setOpenParent(false);
            setAlertState({ open: true, message: result.data.name + " has been archived" });
            setPrograms((prevPrograms: ProgramMap) => {
              if (Object.keys(prevPrograms).includes(result.data._id))
                return { ...prevPrograms, [result.data._id]: { ...result.data } };
              else console.log("Program ID does not exist");
              return prevPrograms;
            });
          } else {
            console.log(result.error);
            alert("Unable to archive program: " + result.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Dialog open={openArchive}>
      <div className="pointer-events-none absolute inset-3 flex h-[10%] justify-end">
        <DialogTrigger asChild>
          {!isMobile ? (
            <Button
              label="Archive"
              kind="destructive-secondary"
              className="pointer-events-auto"
              onClick={() => {
                setOpenArchive(true);
              }}
            />
          ) : (
            <div
              className="pointer-events-auto pt-1 text-destructive"
              onClick={() => {
                setOpenArchive(true);
              }}
            >
              Archive
            </div>
          )}
        </DialogTrigger>
      </div>
      <DialogContentSlide className="w-full bg-white object-right sm:w-[50%]">
        <div className="flex flex-col justify-center">
          <div className="pl-12 pr-20 sm:pl-24">
            <ProgramArchiveHeader label={data.name} />
            <p className="pb-3 pt-4 text-sm">Confirm by entering today&apos;s date</p>
            <form>
              <Textfield
                className="mb-12"
                name="date"
                placeholder="Date"
                register={archiveRegister}
                calendar={true}
                setCalendarValue={setArchiveCalendarValue}
              />
              <div className="flex flex-row gap-3">
                <DialogClose asChild>
                  <Button
                    label="Back"
                    kind="destructive-secondary"
                    onClick={() => {
                      setOpenArchive(false);
                    }}
                  />
                </DialogClose>
                <DialogClose asChild>
                  <Button label="Archive" onClick={archive} kind="destructive" />
                </DialogClose>
              </div>{" "}
            </form>
          </div>{" "}
        </div>
      </DialogContentSlide>
    </Dialog>
  );
}
