import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useWindowSize } from "../hooks/useWindowSize";
import { cn } from "../lib/utils";

import { Button } from "./Button";
import ProgramArchiveHeader from "./ProgramForm/ProgramArchive";
import { ProgramInfo } from "./ProgramForm/ProgramInfo";
import { ProgramData } from "./ProgramForm/types";
import { Textfield } from "./Textfield";
import { Dialog, DialogClose, DialogContent, DialogContentSlide, DialogTrigger } from "./ui/dialog";

type BaseProperties = {
  classname?: string;
};

type EditProperties = BaseProperties & {
  type: "edit";
  data: ProgramData | null;
};

type AddProperties = BaseProperties & {
  type: "add";
  data?: ProgramData | null;
};

type ProgramFormProperties = EditProperties | AddProperties;

export default function ProgramFormButton({
  type = "edit",
  data = null,
  classname,
}: ProgramFormProperties) {
  const { register, setValue: setCalendarValue, reset, handleSubmit } = useForm<ProgramData>();
  const {
    register: archiveRegister,
    reset: archiveReset,
    setValue: setArchiveCalendarValue,
    getValues: getArchiveValue,
  } = useForm<{ date: string }>();

  const [openForm, setOpenForm] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const { width } = useWindowSize().windowSize;
  const isMobile = useMemo(() => width <= 640, [width]);

  const onSubmit: SubmitHandler<ProgramData> = (formData: ProgramData) => {
    setOpenForm(false);
    reset();
    console.log(`${type} program`, formData);
  };

  return !isMobile ? (
    <>
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogTrigger asChild>
          <Button
            label={type === "add" ? "Add Program" : "Edit Program"}
            onClick={() => {
              setOpenForm(true);
            }}
          />
        </DialogTrigger>
        <DialogContentSlide className="w-full bg-white object-right p-6 sm:w-[50%]">
          <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
            {type === "edit" && (
              <Dialog open={openArchive}>
                <div className="absolute inset-3 flex h-auto justify-end">
                  <DialogTrigger asChild>
                    <Button
                      label="Archive"
                      kind="destructive-secondary"
                      onClick={() => {
                        setOpenArchive(true);
                      }}
                    />
                  </DialogTrigger>
                </div>
                <DialogContentSlide className="w-full bg-white object-right sm:w-[50%]">
                  <div className="flex flex-col justify-center">
                    <div className="pl-24 pr-20">
                      <ProgramArchiveHeader label={data ? data.name : ""} />
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
                            <Button
                              label="Archive"
                              onClick={() => {
                                const date = new Date(getArchiveValue("date"));
                                const today = new Date();
                                if (
                                  date.getUTCDate() === today.getUTCDate() &&
                                  date.getUTCMonth() === today.getUTCMonth() &&
                                  date.getUTCFullYear() === today.getUTCFullYear()
                                ) {
                                  //set archive to true
                                  archiveReset();
                                  setOpenArchive(false);
                                  setOpenForm(false);
                                }
                              }}
                              kind="destructive"
                            />
                          </DialogClose>
                        </div>{" "}
                      </form>
                    </div>{" "}
                  </div>
                </DialogContentSlide>
              </Dialog>
            )}

            <h2 className="mb-4 text-2xl font-bold text-neutral-800">
              {type === "add" ? "Add new program" : data?.name}
            </h2>
            <ProgramInfo
              classname="w-full"
              register={register}
              data={data ?? null}
              setCalendarValue={setCalendarValue}
            />

            <div className="flex flex-row-reverse items-end gap-3">
              <Dialog>
                <Button label={type === "add" ? "Create" : "Save Changes"} type="submit" />
                <DialogTrigger>
                  <Button label="Cancel" kind="secondary" type="button" />
                </DialogTrigger>
                <DialogContent className="max-h-[40%] w-auto max-w-[80%] rounded-[8px] md:max-w-[50%]">
                  <div className="p-3 min-[450px]:p-10">
                    <div className="flex w-full justify-center">
                      <div className="flex h-10 w-10 items-center rounded-full bg-destructive">
                        <svg
                          className="w-full"
                          width="14"
                          height="23"
                          viewBox="0 0 12 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.39587 6.3333C3.39587 4.87518 4.7034 3.72888 6.00004 3.72888C7.29668 3.72888 8.60421 4.87518 8.60421 6.3333C8.60421 7.08559 8.42537 7.47963 8.23915 7.74343C8.01287 8.064 7.6959 8.31661 7.14587 8.72914L7.0909 8.77032C6.60135 9.13696 5.9092 9.65531 5.37457 10.4127C4.77953 11.2557 4.43754 12.2939 4.43754 13.625C4.43754 14.4879 5.13709 15.1875 6.00004 15.1875C6.86298 15.1875 7.56254 14.4879 7.56254 13.625C7.56254 12.8727 7.74138 12.4786 7.92759 12.2148C8.15388 11.8943 8.47084 11.6417 9.02087 11.2291L9.07584 11.1879C9.5654 10.8213 10.2575 10.303 10.7922 9.54557C11.3872 8.7026 11.7292 7.66435 11.7292 6.3333C11.7292 3.00064 8.87007 0.603882 6.00004 0.603882C3.13001 0.603882 0.270874 3.00064 0.270874 6.3333C0.270874 7.19625 0.970429 7.8958 1.83337 7.8958C2.69632 7.8958 3.39587 7.19625 3.39587 6.3333Z"
                            fill="white"
                          />
                          <path
                            d="M6.00004 20.9166C7.15063 20.9166 8.08337 19.9839 8.08337 18.8333C8.08337 17.6827 7.15063 16.75 6.00004 16.75C4.84945 16.75 3.91671 17.6827 3.91671 18.8333C3.91671 19.9839 4.84945 20.9166 6.00004 20.9166Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="mb-1 mt-5 text-center text-xl font-bold">
                      Are you sure you want to leave?
                    </p>
                    <p className="font-base mb-6 text-center text-base">
                      Your changes will not be saved
                    </p>
                    <div className="grid gap-6 min-[450px]:flex min-[450px]:justify-center">
                      <DialogClose asChild>
                        <Button label="Back" kind="destructive-secondary" />
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          label="Leave"
                          onClick={() => {
                            setOpenForm(false);
                          }}
                          kind="destructive"
                        />
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </DialogContentSlide>
      </Dialog>
    </>
  ) : (
    <>
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogTrigger asChild>
          <Button
            label={type === "add" ? "Add Program" : "Edit Program"}
            onClick={() => {
              setOpenForm(true);
            }}
          />
        </DialogTrigger>
        <DialogContent className="bg-white p-3">
          <DialogClose asChild>
            <div className="absolute cursor-pointer pl-3 pt-4 text-sm text-neutral-400">Cancel</div>
          </DialogClose>
          <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
            <h2 className="pb-6 text-center text-xl font-bold text-neutral-800">
              {type === "add" ? "Add new program" : data?.name}
            </h2>
            <ProgramInfo
              classname=""
              register={register}
              data={data ?? null}
              setCalendarValue={setCalendarValue}
            />
            <DialogClose asChild>
              <div className="pt-6">
                <Button
                  size="wide"
                  label={type === "add" ? "Create" : "Save Changes"}
                  type="submit"
                />
              </div>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
