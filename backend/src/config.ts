import dotenv from "dotenv";

import { InternalError } from "./errors";

//load the env variables from .env file
dotenv.config({ path: ".env" });

function throwIfUndefined(envVar: string | undefined, error: InternalError) {
  if (!envVar) throw error;
  return envVar;
}

// Check if the required env variables are defined
const port = throwIfUndefined(process.env.APP_PORT, InternalError.NO_APP_PORT);
const mongoURI = throwIfUndefined(process.env.MONGO_URI, InternalError.NO_MONGO_URI);
const serviceAccountKey = throwIfUndefined(
  process.env.SERVICE_ACCOUNT_KEY,
  InternalError.NO_SERVICE_ACCOUNT_KEY,
);

const firebaseConfig = throwIfUndefined(
  process.env.FIREBASE_CONFIG,
  InternalError.NO_FIREBASE_CONFIG,
);

export { port, mongoURI, serviceAccountKey, firebaseConfig };
