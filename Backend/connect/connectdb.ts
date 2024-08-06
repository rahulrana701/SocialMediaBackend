import mongoose from "mongoose";
// eslint-disable-next-line turbo/no-undeclared-env-vars
const baseurl = process.env.DB_URL;
const connectionString = `${baseurl}`;

export const dbconnect = async () => {
  mongoose.connect(connectionString);
};
