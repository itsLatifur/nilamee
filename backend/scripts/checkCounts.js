import { config as loadEnv } from "dotenv";
import mongoose from "mongoose";
import appConfig from "../config/appConfig.js";

// Load backend config same as app.js (path relative to `backend` working dir)
loadEnv({ path: "./config/config.env" });

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(
      "MONGO_URI not set in config/config.env.\nPlease set it and rerun: node scripts/checkCounts.js"
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { dbName: appConfig.databaseName });
    console.log("Connected to DB:", appConfig.databaseName);
    const db = mongoose.connection.db;

    const usersCount = await db.collection("users").countDocuments();
    const auctionsCount = await db.collection("auctions").countDocuments();
    const escrowsCount = await db
      .collection("escrows")
      .countDocuments()
      .catch(() => 0);
    const metrics = await db
      .collection("sitemetrics")
      .findOne({ _id: "site_metrics" })
      .catch(() => null);

    console.log("users:", usersCount);
    console.log("auctions:", auctionsCount);
    console.log("escrows:", escrowsCount);
    console.log("site_metrics:", metrics);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error connecting or reading collections:", err);
    process.exit(2);
  }
}

main();
