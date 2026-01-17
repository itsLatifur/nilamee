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

    const escrows = await Escrow.find({
      status: "Released",
      processedAt: null,
      adminHold: false,
    })
      .populate("auctionId")
      .populate("sellerId");

    for (const escrow of escrows) {
      try {
        const commissionAmount = escrow.commissionAmount || 0;
        const sellerAmount =
          escrow.sellerAmount || escrow.totalAmount - commissionAmount;

        // create commission record
        try {
          await Commission.create({
            amount: commissionAmount,
            user: escrow.sellerId,
          });
        } catch (err) {
          console.error("Commission create failed for escrow", escrow._id, err);
        }

        // snapshot seller payment info and update stats
        try {
          const seller = await User.findById(escrow.sellerId).select(
            "paymentInfo userName email totalTransactionVolume completedAuctionsCount stats",
          );
          if (seller && seller.paymentInfo) {
            escrow.payoutInfo = {
              method:
                seller.paymentInfo.bankName ||
                seller.paymentInfo.mobileWallet ||
                "",
              account:
                seller.paymentInfo.bankAccountNumber ||
                seller.paymentInfo.mobileWalletNumber ||
                "",
              name: seller.paymentInfo.bankAccountName || seller.userName || "",
            };

            seller.totalTransactionVolume =
              (seller.totalTransactionVolume || 0) + sellerAmount;
            seller.completedAuctionsCount =
              (seller.completedAuctionsCount || 0) + 1;
            seller.stats = seller.stats || {};
            seller.stats.totalAuctionsCompleted =
              (seller.stats.totalAuctionsCompleted || 0) + 1;
            seller.lastActivityDate = new Date();
            await seller.save();

            await TransactionHistory.create({
              userId: seller._id,
              auctionId: escrow.auctionId._id,
              role: "Auctioneer",
              amount: sellerAmount,
              auctionTitle: escrow.auctionId.title || "",
              outcome: "Success",
            });
          }
        } catch (err) {
          console.error(
            "Snapshot seller info failed for escrow",
            escrow._id,
            err,
          );
        }

        escrow.processedAt = new Date();
        await escrow.save();

        try {
          await Notification.create({
            userId: escrow.sellerId,
            title: "Payout Processed",
            message: `Your payout of BDT ${sellerAmount.toFixed(2)} for auction ${escrow.auctionId.title} has been processed.`,
            type: "info",
          });
        } catch (err) {
          console.error(
            "Notification create failed for escrow",
            escrow._id,
            err,
          );
        }

        console.log("Processed escrow", escrow._id.toString());
      } catch (err) {
        console.error("Error processing escrow", escrow._id, err);
      }
    }

    console.log(`Processed ${escrows.length} escrows.`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to process escrows:", err);
    process.exit(1);
  }
};

if (require.main === module) {
  processEscrows();
}
