import React, { useState } from "react";

import { Day, Program, createProgram } from "../api/program"
import { handleAPIError } from "../api/requests";

import styles from "./ProgramForm.module.css";
import { Textfield } from "./Textfield";



/**
 * 
 */
export type ProgramFormProperties = {
    mode: "create" | "edit";
    program?: Program;
    onSubmit?: (program: Program) => void;
}


/**
 * 
 */
type ProgramFormErrors = {
    name?: boolean;
    abbreviation?: boolean;
    type?: boolean;
    days?: boolean;
    start?: boolean;
    end?: boolean;
    color?: boolean;
}


export function ProgramForm({ mode, program, onSubmit }: ProgramFormProperties) {
    const [name, setName] = useState<string>(program?.name ?? "");
    const [abbreviation, setAbbreviation] = useState<string>(program?.abbreviation ?? "");
    const [type, setType] = useState<string>(program?.type ?? "");
    const [days, setDays] = useState<Day[]>(program?.days ?? []);
    const [start, setStart] = useState<string>(program?.start ?? "");
    const [end, setEnd] = useState<string>(program?.end ?? "");
    const [color, setColor] = useState<string>(program?.color ?? "");

    const [isLoading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ProgramFormErrors>({});

    const handleSubmit = () => {
        if (name.length === 0) { setErrors({ name: true })};
        if (abbreviation.length === 0) { setErrors({ abbreviation: true })};
        if (type.length === 0) { setErrors({ type: true })};
        if (days.length === 0) { setErrors({ days: true })};
        if (start.length === 0) { setErrors({ start: true })};
        if (end.length === 0) { setErrors({ end: true })};
        if (color.length === 0) { setErrors({ color: true })};
        if (
            errors.name ?? errors.abbreviation ?? errors.type ?? errors.days ?? errors.start
            ?? errors.end ?? errors.color
        ) { return; }

        setLoading(true);

        createProgram({ name, abbreviation, type, days, start, end, color }).catch(
            err => handleAPIError(err)
        ).then(
            (result) => {
                if (result.success) {
                    setName("");
                    setAbbreviation("");
                    setType("");
                    setDays([]);
                    setStart("");
                    setEnd("");
                    setColor("");

                    onSubmit && onSubmit(result.data);
                } else {
                    alert(result.error);
                }

                setLoading(false);
            }
        );

    };

    const formTitle = (mode === "create" ? "Add New Program" : program?.name);

    return (
        <form className={styles.form}>
            <span className={styles.formTitle}>{formTitle}</span>
            <div className={styles.formContainer}>

            </div>
        </form>
    );
}