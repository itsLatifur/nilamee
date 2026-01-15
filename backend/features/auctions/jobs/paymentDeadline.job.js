import cron from "node-cron";
import { Auction } from "../auctions.model.js";
import { User } from "../../users/users.model.js";
import { sendEmail } from "../../../utils/sendEmail.js";

export const paymentDeadlineCron = () => {
  // Run every 10 minutes to check for expired payment deadlines
  cron.schedule("*/10 * * * *", async () => {
    const now = new Date();
    console.log("Cron for payment deadline running...");

    try {
      // Find auctions where payment deadline has passed and payment is still unpaid
      const expiredAuctions = await Auction.find({
        paymentStatus: "Unpaid",
        paymentDeadline: { $lt: now },
        overallStatus: "Ended - Awaiting Payment",
      }).populate("highestBidder createdBy");

      for (const auction of expiredAuctions) {
        try {
          // Mark auction as cancelled
          auction.overallStatus = "Cancelled";
          auction.paymentStatus = "Failed";
          await auction.save();

          const winner = auction.highestBidder;
          const seller = auction.createdBy;

          // Notify seller
          if (seller && seller.email) {
            const sellerSubject = `Auction Cancelled - Payment Not Received`;
            const sellerMessage = `Dear ${
              seller.userName
            },\n\nUnfortunately, your auction "${
              auction.title
            }" has been cancelled because the winner did not complete payment within the 24-hour deadline.\n\n**Auction Details:**\n- Item: ${
              auction.title
            }\n- Winning Bid: BDT ${auction.currentBid}\n- Winner: ${
              winner ? winner.userName : "N/A"
            }\n- Payment Deadline: ${auction.paymentDeadline.toLocaleString(
              "en-BD",
              { timeZone: "Asia/Dhaka" }
            )}\n\nYou can choose to:\n1. Relist the item as a new auction\n2. Contact our support team if you have questions\n\nWe apologize for the inconvenience.\n\nBest regards,\nNilamee Auction Team`;

            await sendEmail({
              email: seller.email,
              subject: sellerSubject,
              message: sellerMessage,
            });
          }

          // Notify winner (with warning about non-payment)
          if (winner && winner.email) {
            const winnerSubject = `Auction Cancelled - Payment Deadline Missed`;
            const winnerMessage = `Dear ${
              winner.userName
            },\n\nYour won auction "${
              auction.title
            }" has been cancelled because payment was not completed within the 24-hour deadline.\n\n**Auction Details:**\n- Item: ${
              auction.title
            }\n- Winning Bid: BDT ${
              auction.currentBid
            }\n- Payment Deadline: ${auction.paymentDeadline.toLocaleString(
              "en-BD",
              { timeZone: "Asia/Dhaka" }
            )}\n\n**Important:**\nRepeated failures to complete payment may result in restrictions on your account.\n\nPlease ensure you complete payments promptly in future auctions.\n\nBest regards,\nNilamee Auction Team`;

            await sendEmail({
              email: winner.email,
              subject: winnerSubject,
              message: winnerMessage,
            });
          }

          console.log(
            `Cancelled auction ${auction._id} due to payment deadline expiration`
          );
        } catch (error) {
          console.error(
            `Error processing expired auction ${auction._id}:`,
            error
          );
        }
      }

      if (expiredAuctions.length > 0) {
        console.log(`Processed ${expiredAuctions.length} expired auction(s)`);
      }
    } catch (error) {
      console.error("Error in payment deadline cron:", error);
    }
  });
};
