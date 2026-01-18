import dotenv from "dotenv";
import mongoose from "mongoose";
import { Escrow } from "../features/escrow/escrow.model.js";
import { User } from "../features/users/users.model.js";
import { Commission } from "../features/commissions/commissions.model.js";
import { TransactionHistory } from "../features/transactions/transactionHistory.model.js";
import { Notification } from "../models/notificationSchema.js";
import connectDB from "../database/connection.js";

// Small utility script to process Released-but-unprocessed escrows automatically.
// Run periodically (cron) to snapshot seller payout info and record commission + transaction history.

dotenv.config();

const processEscrows = async () => {
  try {
    await connectDB();

    // Automatic processing of Released escrows has been disabled.
    // Payouts must be triggered by the buyer's `receiveEscrow` action.
    console.log(
      "Automatic escrow processing disabled: payouts are buyer-triggered.",
    );
    process.exit(0);
  } catch (err) {
    console.error("Failed to process escrows:", err);
    process.exit(1);
  }
};

if (require.main === module) {
  processEscrows();
}
