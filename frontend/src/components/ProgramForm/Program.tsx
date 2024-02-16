import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { cn } from "../../lib/utils";
import { Textfield } from "../Textfield";

import { ProgramData } from "./types";


type ProgramProperties = {
    register: UseFormRegister<ProgramData>;
    classname?: string;
    setCalendarValue: UseFormSetValue<ProgramData>;
    data: ProgramData | null;
}


export default function Program({ register, classname, setCalendarValue, data }: ProgramProperties) {
    return (
        <div className={cn(classname)}>
            <div>
                <h3>Program Name</h3>
                <Textfield register={register} name="name" placeholder="Entrepreneur" defaultValue={data?.name}/>
            </div>
            <div>
                <h3>Program Abbreviation</h3>
                <Textfield register={register} name="abbreviation" placeholder="ENTR" defaultValue={data?.abbreviation}/>
            </div>
            <div>
                <h3>Program Type</h3>
            </div>
            <div>
                <h3>Program Days</h3>
            </div>
            <div>
                <h3>Start Date</h3>
                <Textfield register={register} name="start" placeholder="Select Date" calendar={true} setCalendarValue={setCalendarValue} defaultValue={data?.start}/>
            </div>
            <div>
                <h3>End Date</h3>
                <Textfield register={register} name="end" placeholder="End DAte" calendar={true} setCalendarValue={setCalendarValue} defaultValue={data?.end}/>
            </div>
            <div>
                <h3>Color</h3>
            </div>
        </div>
    )
}