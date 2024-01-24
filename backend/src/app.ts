import { json } from "body-parser";
import express from "express";
import mongoose from "mongoose";

import { mongoURI, port } from "./config";
import { userRouter } from "./routes/userRoute";
import { errorHandler } from "./errors/handler";

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

// Middleware
server.app.use(json());

// Routes
server.app.use(userRouter);

// Error Handler
server.app.use(errorHandler);

// make server listen on some port
server.app.listen(port, () => {
  console.log(`> Listening on port ${port}`);
});
