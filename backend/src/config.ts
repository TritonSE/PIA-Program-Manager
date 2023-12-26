import dotenv from "dotenv";

import { InternalError } from "./errors";

//load the env variables from .env file
dotenv.config({ path: ".env" });

let portV = "";

if (!process.env.APP_PORT) {
  throw InternalError.NO_APP_PORT;
} else {
  portV = process.env.APP_PORT;
}

/**
 * Have to do this workaround since lint doesn't let
 * us export vars
 */
const port = portV;

export { port };
