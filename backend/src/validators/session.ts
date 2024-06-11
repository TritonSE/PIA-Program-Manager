import { body } from "express-validator";

const makeIdValidator = () =>
  body("_id")
    .exists()
    .withMessage("_id needed")
    .bail()
    .isString()
    .withMessage("_id must be a string")
    .bail()
    .notEmpty()
    .withMessage("_id must not be empty");
const makeProgramIdValidator = () =>
  body("programId")
    .exists()
    .withMessage("programId needed")
    .bail()
    .isString()
    .withMessage("programId must be a string")
    .bail()
    .notEmpty()
    .withMessage("programId must not be empty");
const makeSessionValidator = () =>
  body("sessionTime")
    .exists()
    .withMessage("Must specify a session time")
    .bail()
    .custom((session: { start_time: string; end_time: string }) => {
      // Assumes program type is regular
      if (!(session.start_time && session.end_time)) throw new Error("Must specify a session time");
      if (typeof session.start_time !== "string" || typeof session.end_time !== "string")
        throw new Error("Session times must be strings");
      if (!new RegExp("^([01][0-9]|0[0-9]|2[0-3]):[0-5][0-9]$").test(session.start_time))
        throw new Error("Time must mach HH:MM format (ex. 09:00)");
      if (!new RegExp("^([01][0-9]|0[0-9]|2[0-3]):[0-5][0-9]$").test(session.end_time))
        throw new Error("Time must mach HH:MM format (ex. 09:00)");
      return true;
    });
const makeStudentsValidator = () =>
  body("students")
    .exists()
    .withMessage("Must specify studenst")
    .bail()
    .isArray()
    .withMessage("Must be an array of student info")
    .custom(
      (
        students: {
          studentId: string;
          attended: boolean;
          hoursAttended: number;
        }[],
      ) => {
        students.forEach((student) => {
          if (!(student.studentId && student.hoursAttended))
            throw new Error("Must specify a id, whether they attended, and time attended");
          if (typeof student.studentId !== "string") throw new Error("StudentId must be a string");
          if (typeof student.attended !== "boolean") throw new Error("attended must be a boolean");
          if (
            typeof student.hoursAttended !== "number" &&
            !(typeof student.hoursAttended === "string" && !isNaN(student.hoursAttended))
          ) {
            throw new Error("hoursAttended must be a number");
          }
        });
        return true;
      },
    );
const makeStudentValidator = () =>
  body("student")
    .exists()
    .withMessage("Must specify studenst")
    .bail()
    .custom((student: { studentId: string; attended: boolean; hoursAttended: number }) => {
      if (!(student.studentId && student.hoursAttended))
        throw new Error("Must specify a id, whether they attended, and time attended");
      if (typeof student.studentId !== "string") throw new Error("StudentId must be a string");
      if (typeof student.attended !== "boolean") throw new Error("attended must be a boolean");
      if (
        typeof student.hoursAttended !== "number" &&
        !(typeof student.hoursAttended === "string" && !isNaN(student.hoursAttended))
      ) {
        throw new Error("hoursAttended must be a number");
      }
      return true;
    });
const makeDateValidator = () => body("date").exists().withMessage("date needed").bail();

export const updateSession = [
  makeIdValidator(),
  makeProgramIdValidator(),
  makeSessionValidator(),
  makeStudentsValidator(),
];

export const absenceSession = [
  makeProgramIdValidator(),
  makeStudentValidator(),
  makeDateValidator(),
];
