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
                    <Button label={type === "add" ? "Add Program": "Edit Program"} onClick={() => {setOpenForm(true);}}/>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)} className={cn(classname)}>
                        <Program register={register} data={data ?? null} setCalendarValue={setCalendarValue}/>
                        <div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button label="Cancel" kind="secondary"/>
                                </DialogTrigger>
                                <DialogContent>
                                    <div>
                                        <p>Leave without saving changes?</p>
                                        <div>
                                            <DialogClose asChild>
                                                <Button label="Back" kind="secondary"/>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button label="Continue" onClick={() => { setOpenForm(false); }}/>
                                            </DialogClose>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <DialogClose asChild>
                                <Button label="Save Changes" type="submit"/>
                            </DialogClose>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}