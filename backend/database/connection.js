import mongoose from "mongoose";
import appConfig from "../config/appConfig.js";

export const connection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: appConfig.databaseName,
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Some error occured while connecting to database: ${err}`);
    });
};
