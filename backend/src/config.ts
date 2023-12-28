import dotenv from "dotenv";

import { InternalError } from "./errors";

//load the env variables from .env file
dotenv.config({ path: ".env" });

let portV = "";
let mongoV = "";

if (!process.env.APP_PORT) {
  throw InternalError.NO_APP_PORT;
} else {
  portV = process.env.APP_PORT;
}

if (!process.env.MONGO_URI) {
  throw InternalError.NO_MONGO_URI;
} else {
  mongoV = process.env.MONGO_URI;
}

/**
 * Have to do this workaround since lint doesn't let
 * us export vars
 */
const port = portV;
const mongoURI = mongoV;

export { port, mongoURI };
