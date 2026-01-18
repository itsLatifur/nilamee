import { User } from "../features/users/users.model.js";
import { PaymentProof } from "../models/commissionProofSchema.js";
import { Commission } from "../models/commissionSchema.js";
import cron from "node-cron";
import { sendEmail } from "../utils/sendEmail.js";

export const verifyCommissionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running Verify Commission Cron...");
    const approvedProofs = await PaymentProof.find({ status: "Approved" });
    for (const proof of approvedProofs) {
      try {
        const user = await User.findById(proof.userId);
        if (user) {
          // Manual commission proofs are no longer required. However, keep a record for audit.
          await PaymentProof.findByIdAndUpdate(proof._id, {
            status: "Settled",
          });
          await Commission.create({
            amount: proof.amount,
            user: user._id,
          });
          const settlementDate = new Date(Date.now())
            .toString()
            .substring(0, 15);

          const subject = `Your Payment Proof Recorded`;
          const message = `Dear ${user.userName},\n\nWe have recorded your payment proof and settled it in our system for auditing. Manual commission payments are no longer required — the platform handles commissions automatically.\n\nPayment Details:\nAmount Recorded: ${proof.amount}\nDate of Record: ${settlementDate}\n\nBest regards,\nNilamee Auction Team`;
          sendEmail({ email: user.email, subject, message });
        }
        console.log(`User ${proof.userId} paid commission of ${proof.amount}`);
      } catch (error) {
        console.error(
          `Error processing commission proof for user ${proof.userId}: ${error.message}`,
        );
      }
    }
  });
};
