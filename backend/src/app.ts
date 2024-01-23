import { json } from "body-parser";
import express from "express";
import mongoose from "mongoose";

import programFormRoutes from "../src/routes/program-form";

import { mongoURI, port } from "./config";

/**
 * Express server application class
 */
class Server {
  public app = express();
}

// initialize server app
const server = new Server();

void mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to Database.");
  })
  .catch((error) => {
    console.log(error);
  });

server.app.use(json());
server.app.use("/api/programForm", programFormRoutes);

// make server listen on some port
server.app.listen(port, () => {
  console.log(`> Listening on port ${port}`);
});
