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
        // Preliminary input validation
        setErrors({});
        if (name.length === 0) {
            setErrors({ name: true });
            return;
        }
        if (abbr.length === 0) {
            setErrors({ abbr: true });
            return;
        }

        setLoading(true);
        createTask({ name, abbr, type, start, end, color }).then((result) => {
            if (result.success) {
                // Clear form
                setName("");
                setAbbr("");
                setType("regular");
                setStart(new Date());
                setEnd(new Date());
                setColor("teal");

                if (onSubmit) {
                    onSubmit(result.data);
                }
            } else {
                alert(result.error);
            }
            
            setLoading(false);
        });
    }

    const formTitle = (mode === "create" ? "Add New Program" : name);

    return (
        <form className={styles.form}></form>
    );
}