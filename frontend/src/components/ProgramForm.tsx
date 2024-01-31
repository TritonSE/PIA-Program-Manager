import React, { useState } from "react";
import { createProgram, type Program } from "src/api/programs";
import styles from "src/components/EditProgram.module.css";


/**
 * 
 */
export interface ProgramFormProperties {
    mode: "create" | "edit";
    program?: Program;
    onSubmit?: (program: Program) => void;
}


/**
 * 
 */
interface ProgramFormErrors {
    name?: boolean;
    abbr?: boolean;
    type?: boolean;
    start?: boolean;
    end?: boolean;
    color?: boolean;
}


export function ProgramForm({ mode, program, onSubmit }: ProgramFormProperties) {
    const [name, setName] = useState<string>(program?.title || "");
    const [abbr, setAbbr] = useState<string>(program?.abbr || "");
    const [type, setType] = useState<string>(program?.type || "");
    const [start, setStart] = useState<Date>(program?.start || "");
    const [end, setEnd] = useState<Date>(program?.end || "");
    const [color, setColor] = useState<string>(program?.color || "");

    const [isLoading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ProgramFormErrors>({});

    const handleSubmit = () => {
        setErrors({});

        // TODO: Input validation

        setLoading(true);
        createTask({ name, abbr, type, start, end, color }).then((result) => {
            setLoading(false);
        });
    }

    const formTitle = (mode === "create" ? "Add New Program" : name);

    return (
        <form className={styles.form}></form>
    );
}