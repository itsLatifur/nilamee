import cron from "node-cron";
import { Auction } from "../auctions.model.js";
import { User } from "../../users/users.model.js";
import { Bid } from "../../bids/bids.model.js";
import { sendEmail } from "../../../shared/utils/email.util.js";
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
          const subject = `Congratulations! You won the auction for ${auction.title}`;
          const message = `Dear ${
            bidder.userName
          }, \n\nCongratulations! You have won the auction for ${
            auction.title
          }. \n\nBefore proceeding with payment, please contact your auctioneer via email: ${
            auctioneer.email
          }\n\nTo complete your payment securely, please use our SSLCommerz payment gateway:\n\n**Payment Link:** ${
            process.env.FRONTEND_URL
          }/auction/${
            auction._id
          }/payment\n\n**Payment Details:**\n- Auction Item: ${
            auction.title
          }\n- Final Bid Amount: BDT ${auction.currentBid}\n- Auctioneer: ${
            auctioneer.userName
          }\n- Auctioneer Email: ${auctioneer.email}\n- Auctioneer Phone: ${
            auctioneer.phone || "N/A"
          }\n\n**Payment Options:**\n- Pay securely online using SSLCommerz (Credit/Debit Card, Mobile Banking, Internet Banking)\n- Cash on Delivery (COD) - requires 20% upfront payment through SSLCommerz\n\nFor COD:\n1. Pay 20% (BDT ${
            auction.currentBid * 0.2
          }) upfront using the payment link above\n2. Pay remaining 80% upon delivery\n3. To inspect the item condition, contact the auctioneer at: ${
            auctioneer.email
          }\n\nPlease ensure your payment is completed within 7 days. Once we confirm the payment, the item will be shipped to you.\n\nThank you for participating!\n\nBest regards,\nNilamee Auction Team`;
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
