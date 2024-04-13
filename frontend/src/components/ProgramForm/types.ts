/**
 *
 */

/**
 *
 */
export type ProgramData = {
  name: string;
  abbreviation: string;
  type: string;
  days: string[];
  start: string;
  end: string;
  color: string;
  renewal: string;
  hourly: string;
  sessions: string[][];
};

export type programColor = "teal" | "green" | "red" | "yellow" | "blue" | "violet" | "fuchsia";
