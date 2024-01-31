/**
 * 
 */

import { type APIResult, GET, handleAPIError, POST } from "src/api/requests";


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


/**
 * 
 */
export interface ProgramRequest {
    name: string;
    abbr: string;
    type: "regular" | "varying";
    start: Date;
    end: Date;
    color: "teal" | "yellow" | "red" | "green";
}


/**
 * 
 * @param program 
 * @returns 
 */
export async function createProgram(program: ProgramRequest): Promise<APIResult<Program>> {
    try {
        const response = await POST("/api/program", program);
        const json = (await response.json()) as ProgramJSON;
        return { success: true, data: parseProgram(json) };
    } catch (error) {
        handleAPIError(error);
    }
}


/**
 * 
 * @param id 
 * @returns 
 */
export async function getProgram(id: string): Promise<APIResult<Task>> {
    try {
        const response = await GET(`/api/program/${id}`);
        const json = (await response.json()) as ProgramJSON;
        return { success: true, data: parseProgram(json) };
    } catch (error) {
        return handleAPIError(error);
    }
}
