import mongoose from "mongoose";
import { connection } from "../database/connection.js";
import { Auction } from "../features/auctions/auctions.model.js";
import { Escrow } from "../features/escrow/escrow.model.js";
import { User } from "../features/users/users.model.js";

// One-off script to backfill addedByName in adminNotes for Auction and Escrow documents.
// Usage: set MONGO_URI and NODE_ENV appropriately, then run:
//   node backend/scripts/backfillAddedByName.js

const backfill = async () => {
  await connection();

  try {
    console.log("Backfill started: auctions");
    // Process auctions in batches
    const auctionCursor = Auction.find({
      "adminNotes.addedByName": { $in: [null, undefined] },
      "adminNotes.addedBy": { $exists: true },
    }).cursor();
    let aCount = 0;
    for (
      let auction = await auctionCursor.next();
      auction != null;
      auction = await auctionCursor.next()
    ) {
      let changed = false;
      for (let i = 0; i < (auction.adminNotes || []).length; i++) {
        const note = auction.adminNotes[i];
        if (
          (note.addedByName === null ||
            note.addedByName === undefined ||
            note.addedByName === "") &&
          note.addedBy
        ) {
          const user = await User.findById(note.addedBy).select("userName");
          if (user) {
            auction.adminNotes[i].addedByName = user.userName;
            changed = true;
          }
        }
      }
      if (changed) {
        await auction.save();
        aCount++;
        if (aCount % 50 === 0) console.log(`Updated ${aCount} auctions...`);
      }
    }
    console.log(`Auctions updated: ${aCount}`);

    console.log("Backfill started: escrows");
    const escrowCursor = Escrow.find({
      "adminNotes.addedByName": { $in: [null, undefined] },
      "adminNotes.addedBy": { $exists: true },
    }).cursor();
    let eCount = 0;
    for (
      let escrow = await escrowCursor.next();
      escrow != null;
      escrow = await escrowCursor.next()
    ) {
      let changed = false;
      for (let i = 0; i < (escrow.adminNotes || []).length; i++) {
        const note = escrow.adminNotes[i];
        if (
          (note.addedByName === null ||
            note.addedByName === undefined ||
            note.addedByName === "") &&
          note.addedBy
        ) {
          const user = await User.findById(note.addedBy).select("userName");
          if (user) {
            escrow.adminNotes[i].addedByName = user.userName;
            changed = true;
          }
        }
      }
      if (changed) {
        await escrow.save();
        eCount++;
        if (eCount % 50 === 0) console.log(`Updated ${eCount} escrows...`);
      }
    }
    console.log(`Escrows updated: ${eCount}`);

    console.log("Backfill completed.");
  } catch (err) {
    console.error("Backfill error:", err);
  } finally {
    mongoose.disconnect();
  }
};

if (require.main === module) {
  backfill();
}
