import { json } from "body-parser";
import express from "express";
import mongoose from "mongoose";

import { mongoURI, port } from "./config";
// import userRoute from "./routes/userRoute";

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
// server.app.use(userRoute);

// make server listen on some port
server.app.listen(port, () => {
  console.log(`> Listening on port ${port}`);
});



/*
frontend/src/api/createUser.ts


import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../../backend/src/routes/userRoute'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Call createUser from  backend route
      await createUser(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

*/