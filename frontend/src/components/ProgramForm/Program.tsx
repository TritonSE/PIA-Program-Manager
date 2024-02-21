import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { cn } from "../../lib/utils";
import { Button } from "../Button";
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
        <div className="w-[808px] h-[534px] flex-col justify-start items-start gap-6 inline-flex">
            <div className="h-14 relative">
                <div className="left-0 top-0 absolute text-center text-neutral-400 text-base font-normal font-['Poppins'] leading-normal">Program Name</div>
                <div className="w-[808px] h-[0px] left-0 top-[56px] absolute border border-neutral-400"></div>
                <div className="left-0 top-[28px] absolute text-neutral-400 text-base font-normal font-['Poppins'] leading-normal">Entrepreneur</div>
            </div>
            <div className="h-14 relative">
                <div className="left-0 top-0 absolute text-neutral-400 text-base font-normal font-['Poppins'] leading-normal">Program Abbreviation</div>
                <div className="left-0 top-[28px] absolute text-neutral-400 text-base font-normal font-['Poppins'] leading-normal">ENTR</div>
                <div className="w-[808px] h-[0px] left-0 top-[56px] absolute border border-neutral-400"></div>
            </div>
            <div className="relative">
                <div className="left-0 top-0 absolute text-center text-neutral-400 text-base font-normal font-['Poppins'] leading-normal">Program Type</div>
                <div className="w-72 h-12 left-[1px] top-[38px] absolute justify-start items-start inline-flex">
                    <div className="w-36 h-12 px-6 py-3 bg-white bg-opacity-0 rounded-tl rounded-bl border border-neutral-400 justify-center items-center gap-1.5 flex">
                        <div className="text-center text-neutral-800 text-base font-normal font-['Poppins'] leading-normal">Regular</div>
                    </div>
                    <div className="w-36 h-12 px-6 py-3 bg-white bg-opacity-0 rounded-tr rounded-br border-r border-t border-b border-neutral-400 justify-center items-center gap-1.5 flex">
                        <div className="text-center text-neutral-800 text-base font-normal font-['Poppins'] leading-normal">Varying</div>
                    </div>
                </div>
            </div>
            <div className="relative">
                <div className="left-0 top-0 absolute text-neutral-400 text-base font-normal font-['Poppins'] leading-normal">Days of the Week</div>
                <div className="w-[264px] h-10 left-0 top-[32px] absolute justify-start items-start gap-4 inline-flex">
                    <div className="w-10 h-10 p-2.5 rounded-[20px] border border-neutral-400 flex-col justify-center items-center gap-2.5 inline-flex">
                        <div className="text-black text-base font-normal font-['Poppins'] leading-normal">M</div>
                    </div>
                    <div className="w-10 h-10 p-2.5 rounded-[20px] border border-neutral-400 flex-col justify-center items-center gap-2.5 inline-flex">
                        <div className="text-black text-base font-normal font-['Poppins'] leading-normal">T</div>
                    </div>
                    <div className="w-10 h-10 p-2.5 rounded-[20px] border border-neutral-400 flex-col justify-center items-center gap-2.5 inline-flex">
                        <div className="text-black text-base font-normal font-['Poppins'] leading-normal">W</div>
                    </div>
                    <div className="w-10 h-10 p-2.5 rounded-[20px] border border-neutral-400 flex-col justify-center items-center gap-2.5 inline-flex">
                        <div className="text-black text-base font-normal font-['Poppins'] leading-normal">TH</div>
                    </div>
                    <div className="w-10 h-10 p-2.5 rounded-[20px] border border-neutral-400 flex-col justify-center items-center gap-2.5 inline-flex">
                        <div className="text-black text-base font-normal font-['Poppins'] leading-normal">F</div>
                    </div>
                </div>
            </div>
            <div className="w-[484px] h-[72px] relative">
                <div className="w-[230px] h-[72px] left-0 top-0 absolute">
                    <div className="left-0 top-0 absolute text-neutral-400 text-base font-normal font-['Poppins'] leading-normal">Start Date</div>
                    <div className="w-[230px] h-10 px-4 py-2 left-0 top-[32px] absolute bg-zinc-100 rounded border border-neutral-400 justify-start items-center gap-2.5 inline-flex">
                        <div className="w-5 h-5 relative" />
                        <div className="grow shrink basis-0 text-neutral-800 text-base font-normal font-['Poppins'] leading-normal">Select Date</div>
                    </div>
                </div>
                <div className="w-[230px] h-[72px] left-[254px] top-0 absolute">
                    <div className="left-0 top-0 absolute text-neutral-400 text-base font-normal font-['Poppins'] leading-normal">End Date</div>
                    <div className="w-[230px] h-10 px-4 py-2 left-0 top-[32px] absolute bg-zinc-100 rounded border border-neutral-400 justify-start items-center gap-2.5 inline-flex">
                        <div className="w-5 h-5 relative" />
                        <div className="grow shrink basis-0 text-neutral-800 text-base font-normal font-['Poppins'] leading-normal">Select Date</div>
                    </div>
                </div>
            </div>
            <div className="flex-col justify-start items-start gap-2 flex">
                <div className="text-center text-neutral-400 text-base font-normal font-['Poppins'] leading-normal">Color (Cover)</div>
                <div className="justify-start items-start gap-4 inline-flex">
                    <div className="w-10 h-10 bg-red-400 rounded-full border border-neutral-400" />
                    <div className="w-10 h-10 bg-yellow-500 rounded-full border border-neutral-400" />
                    <div className="w-10 h-10 bg-lime-500 rounded-full border border-neutral-400" />
                    <div className="w-10 h-10 bg-slate-500 rounded-full border border-neutral-400" />
                    <div className="w-10 h-10 bg-blue-400 rounded-full border border-neutral-400" />
                    <div className="w-10 h-10 bg-slate-400 rounded-full border border-neutral-400" />
                    <div className="w-10 h-10 bg-fuchsia-400 rounded-full border border-neutral-400" />
                </div>
            </div>
        </div>
    );
}