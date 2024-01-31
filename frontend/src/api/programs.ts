/**
 * 
 */


/**
 * 
 */
export interface Program {
    _id: string;
    name: string;
    abbr: string;
    type: "regular" | "varying";
    start: Date;
    end: Date;
    color: "teal" | "yellow" | "red" | "green";
}


/**
 * 
 */
export interface ProgramJSON {
    _id: string;
    name: string;
    abbr: string;
    type: "regular" | "varying";
    start: string;
    end: string;
    color: "teal" | "yellow" | "red" | "green";
}
