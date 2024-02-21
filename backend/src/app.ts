import { json } from "body-parser";
import cors from "cors";
import express from "express";
import { onRequest } from "firebase-functions/v2/https";
import mongoose from "mongoose";

import { mongoURI, port } from "./config";
import { errorHandler } from "./errors/handler";
import router from "./routes/api";

/**
 * Express server application class
 */
class Server {
  public app = express();
}

// initialize server app
const server = new Server();

// Connect to MongoDB
void mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to Database.");
  })
  .catch((error) => {
    console.log(error);
  });

server.app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
  }),
);

// Middleware
server.app.use(json());

// sets the "Access-Control-Allow-Origin" header on all responses to allow
server.app.use(cors());

// Prepend /api to all routes defined in /routes/api.ts
server.app.use("/api", router);

// Error Handler
server.app.use(errorHandler);

// make server listen on some port
server.app.listen(port, () => {
  console.log(`> Listening on port ${port}`);
});

// Register our express app as a Firebase Function
export const backend = onRequest({ region: "us-west1" }, server.app);
