import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import DownloadIcon from "../../../public/icons/download.svg";
import GreenDownloadIcon from "../../../public/icons/green_download.svg";
import MobileDownloadIcon from "../../../public/icons/mobile_download.svg";
import { Button } from "../Button";
import { Textfield } from "../Textfield";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog";

import DownloadNotesPDF from "./DownloadNotesPDF";
import { ProgressNote } from "./types";

import { useWindowSize } from "@/hooks/useWindowSize";
import { validateDate } from "@/lib/validateDate";
import { StudentWithNotes } from "@/pages/notes";

type DownloadNotesDialogProps = {
  allProgressNotes: Record<string, ProgressNote>;
  selectedStudent: StudentWithNotes;
  studentFullName: string;
};

type DownloadFormData = {
  startDate: string;
  endDate: string;
};

export default function DownloadNotesDialog({
  allProgressNotes,
  selectedStudent,
  studentFullName,
}: DownloadNotesDialogProps) {
  const { register, setValue: setCalendarValue, watch } = useForm<DownloadFormData>({});
  const [downloadNotesError, setDownloadNotesError] = useState("");
  const [downloadDisabled, setDownloadDisabled] = useState(true);
  const downloadStartDate = watch("startDate");
  const downloadEndDate = watch("endDate");
  const { windowSize } = useWindowSize();

  useEffect(() => {
    let error = "";
    let disableDownload = true;

    if (downloadStartDate && !validateDate(downloadStartDate)) {
      error = "Please enter a valid start date in MM/DD/YYYY format";
    } else if (downloadEndDate && !validateDate(downloadEndDate)) {
      error = "Please enter a valid end date in MM/DD/YYYY format";
    } else if (
      downloadStartDate &&
      downloadEndDate &&
      new Date(downloadEndDate) < new Date(downloadStartDate)
    ) {
      error = "End date must be after start date";
    } else if (downloadStartDate && downloadEndDate) {
      disableDownload = false;
    }

    if (error !== downloadNotesError) setDownloadNotesError(error);
    if (disableDownload !== downloadDisabled) setDownloadDisabled(disableDownload);
  }, [downloadStartDate, downloadEndDate, downloadNotesError, downloadDisabled]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {windowSize.width < 1200 ? (
          <button>
            <MobileDownloadIcon className="scale-[1.6]" aria-label="Download Notes" />
          </button>
        ) : (
          <Button label="Download" icon={<DownloadIcon />} />
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[70%] max-w-[80%] rounded-[8px] md:max-w-[50%] lg:max-w-[25%]">
        <div className="grid place-items-center p-3 min-[450px]:p-10 ">
          <GreenDownloadIcon className="mb-8" aria-hidden="true" />
          <h3 className="text-bold mb-5 text-lg font-bold">Select Date Range</h3>
          <form className="flex w-full flex-col items-center gap-5">
            <fieldset className="w-full">
              <legend className="mb-2 text-left ">Start Date</legend>
              <Textfield
                name="startDate"
                placeholder="MM/DD/YYYY"
                calendar={true}
                setCalendarValue={setCalendarValue}
                register={register}
              />
            </fieldset>
            <fieldset className="w-full">
              <legend className="mb-2 w-full text-left ">End Date</legend>
              <Textfield
                name="endDate"
                placeholder="MM/DD/YYYY"
                calendar={true}
                setCalendarValue={setCalendarValue}
                register={register}
              />
            </fieldset>
            <div className=" h-[2em]">
              {downloadNotesError ? (
                <p className={`text-sm text-red-500`}>{downloadNotesError}</p>
              ) : null}
            </div>
            <div className="grid justify-center gap-5 pt-3 min-[450px]:flex min-[450px]:w-[80%] min-[450px]:justify-between min-[450px]:[&>*]:basis-full">
              <DialogClose asChild>
                <Button label="Cancel" kind="secondary" style={{ paddingInline: "0" }} />
              </DialogClose>
              <DownloadNotesPDF
                allProgressNotes={allProgressNotes}
                studentId={selectedStudent._id}
                studentName={studentFullName}
                downloadStartDate={downloadStartDate}
                downloadEndDate={downloadEndDate}
                downloadDisabled={downloadDisabled}
              />
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
