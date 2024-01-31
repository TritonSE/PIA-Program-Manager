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


/**
 * 
 * @param program 
 * @returns 
 */
function parseProgram(program: ProgramJSON): Program {
    return {
        _id: program._id,
        name: program.name,
        abbr: program.abbr,
        type: program.type,
        start: new Date(program.type),
        end: new Date(program.type),
        color: program.color
    };
}
