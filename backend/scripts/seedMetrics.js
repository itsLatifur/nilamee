import { config as loadEnv } from "dotenv";
import mongoose from "mongoose";
import appConfig from "../config/appConfig.js";

loadEnv({ path: "./config/config.env" });

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in config/config.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { dbName: appConfig.databaseName });
    console.log("Connected to DB:", appConfig.databaseName);
    const db = mongoose.connection.db;

    // total approved auctions (count where approvalStatus === 'approved')
    const approvedAuctions = await db
      .collection("auctions")
      .countDocuments({ approvalStatus: "approved" });

    // total auction transactions - use escrows created for paid auctions
    const auctionTransactions = await db
      .collection("escrows")
      .countDocuments()
      .catch(() => 0);

    // commission payments approved
    const paymentProofsApproved = await db
      .collection("paymentproofs")
      .countDocuments({ status: "Approved" })
      .catch(() => 0);

    const totalTransactions = auctionTransactions + paymentProofsApproved;

    // Upsert site_metrics including total users
    const usersCount = await db.collection("users").countDocuments();
    const metricsColl = db.collection("sitemetrics");
    const res = await metricsColl.findOneAndUpdate(
      { _id: "site_metrics" },
      {
        $set: {
          totalAuctionsApproved: approvedAuctions,
          totalTransactionsCount: totalTransactions,
          totalUsers: usersCount,
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    console.log("Seeded site_metrics:", res.value || res);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(2);
  }
}

main();
