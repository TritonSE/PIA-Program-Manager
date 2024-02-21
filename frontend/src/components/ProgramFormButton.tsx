import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { cn } from "../lib/utils";

import { Button } from "./Button";
import Program from "./ProgramForm/Program";
import { ProgramData } from "./ProgramForm/types";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";


type BaseProperties = {
    classname?: string;
}


type EditProperties = BaseProperties & {
    type: "edit";
    data: ProgramData | null;
}


type AddProperties = BaseProperties & {
    type: "add";
    data?: ProgramData | null;
}


type ProgramFormProperties = EditProperties | AddProperties;


export default function ProgramFormButton({type = "edit", data = null, classname}: ProgramFormProperties) {
    const { register, setValue: setCalendarValue, reset, handleSubmit } = useForm<ProgramData>();

    const onSubmit: SubmitHandler<ProgramData> = (formData: ProgramData) => {
        reset();
        console.log(`${type} program`, formData);
    }

    const [openForm, setOpenForm] = useState(false);

    return (
        <>
            <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogTrigger asChild>
                    <Button label={type === "add" ? "Add Program" : "Edit Program"} onClick={() => {setOpenForm(true);}}/>
                </DialogTrigger>
                <DialogContent className="w-[872px] h-[658px] p-8 bg-white rounded-lg flex-col justify-start items-start gap-6 inline-flex">
                    <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
                        <h2 className="text-neutral-800 text-2xl font-bold font-['Poppins'] leading-9 tracking-wide">
                            {type === "add" ? "Add new program" : data?.name}
                        </h2>
                        <Program register={register} data={data ?? null} setCalendarValue={setCalendarValue}/>
                        <div>
                            <DialogClose>
                                <Button label="Cancel" kind="secondary" onClick={() => { setOpenForm(false); }}/>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button label="Create" type="submit"/>
                            </DialogClose>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}