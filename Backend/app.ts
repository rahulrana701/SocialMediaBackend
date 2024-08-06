import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { authencticate } from "./middlewares";
import { dbconnect } from "./connect/connectdb";
import cors from "cors";
const port = 5000;

const app = express();

app.use(cors);

import userRoutes from "./routes/UserRoute";
import postRoutes from "./routes/PostRoute";

app.use("api/User", userRoutes);
app.use("api/Post", authencticate, postRoutes);

const start = async () => {
  try {
    dbconnect();
    app.listen(port, () => {
      console.log(`server listening at ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
