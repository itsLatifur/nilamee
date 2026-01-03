import mongoose from "mongoose";
import appConfig from "../config/appConfig.js";

export const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: appConfig.databaseName,
    });
    console.log("Connected to database.");
  } catch (err) {
    console.log(`Database connection error: ${err}`);
    process.exit(1);
  }
};
