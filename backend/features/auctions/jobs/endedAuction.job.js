import cron from "node-cron";
import { Auction } from "../auctions.model.js";
import { User } from "../../users/users.model.js";
import { Bid } from "../../bids/bids.model.js";
import { sendEmail } from "../../../utils/sendEmail.js";
import { calculateCommission } from "../../commissions/commissions.controller.js";

export const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    console.log("Cron for ended auction running...");
    const endedAuctions = await Auction.find({
      endTime: { $lt: now },
      commissionCalculated: false,
    });
    for (const auction of endedAuctions) {
      try {
        const commissionAmount = await calculateCommission(auction._id);
        auction.commissionCalculated = true;

        // Set payment deadline (24 hours from auction end)
        const paymentDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        auction.paymentDeadline = paymentDeadline;
        auction.paymentStatus = "Unpaid";
        auction.overallStatus = "Ended - Awaiting Payment";

        const highestBidder = await Bid.findOne({
          auctionItem: auction._id,
          amount: auction.currentBid,
        });
        const auctioneer = await User.findById(auction.createdBy);
        auctioneer.unpaidCommission = commissionAmount;
        if (highestBidder) {
          auction.highestBidder = highestBidder.bidder.id;
          await auction.save();
          const bidder = await User.findById(highestBidder.bidder.id);
          await User.findByIdAndUpdate(
            bidder._id,
            {
              $inc: {
                moneySpent: highestBidder.amount,
                auctionsWon: 1,
              },
            },
            { new: true }
          );
          await User.findByIdAndUpdate(
            auctioneer._id,
            {
              $inc: {
                unpaidCommission: commissionAmount,
              },
            },
            { new: true }
          );

          // Calculate deadline display
          const deadlineDate = paymentDeadline.toLocaleString("en-BD", {
            timeZone: "Asia/Dhaka",
            dateStyle: "full",
            timeStyle: "short",
          });

          const subject = `Congratulations! You won the auction for ${auction.title}`;
          const message = `Dear ${
            bidder.userName
          }, \n\nCongratulations! You have won the auction for ${
            auction.title
          }. \n\n**IMPORTANT: Payment Deadline**\nYou must complete payment within 24 hours by ${deadlineDate}\nIf payment is not received by the deadline, this auction will be automatically cancelled.\n\nTo complete your payment securely, please use our SSLCommerz payment gateway:\n\n**Payment Link:** ${
            process.env.FRONTEND_URL
          }/auction/${
            auction._id
          }/payment\n\n**Payment Details:**\n- Auction Item: ${
            auction.title
          }\n- Final Bid Amount: BDT ${
            auction.currentBid
          }\n- Payment Deadline: ${deadlineDate}\n- Auctioneer: ${
            auctioneer.userName
          }\n- Auctioneer Email: ${auctioneer.email}\n- Auctioneer Phone: ${
            auctioneer.phone || "N/A"
          }\n\n**Payment Method:**\nPay securely online using SSLCommerz (Credit/Debit Card, Mobile Banking, Internet Banking)\n\nOnce payment is confirmed:\n1. Funds will be held in escrow for your protection\n2. The seller will ship the item to you\n3. You'll confirm delivery\n4. Funds will be released to the seller\n\nPlease complete your payment as soon as possible to avoid cancellation.\n\nThank you for participating!\n\nBest regards,\nNilamee Auction Team`;
          console.log("SENDING EMAIL TO HIGHEST BIDDER");
          sendEmail({ email: bidder.email, subject, message });
          console.log("SUCCESSFULLY EMAIL SEND TO HIGHEST BIDDER");
        } else {
          await auction.save();
        }
      } catch (error) {
        return next(console.error(error || "Some error in ended auction cron"));
      }
    }
  });
};
