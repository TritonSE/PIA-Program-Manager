import { json } from "body-parser";
import express from "express";

import { port } from "./config";

/**
 * Express server application class
 */
class Server {
  public app = express();
}

// initialize server app
const server = new Server();

server.app.use(json());

// make server listen on some port
server.app.listen(port, () => {
  console.log(`> Listening on port ${port}`);
});
