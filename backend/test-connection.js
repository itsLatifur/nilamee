import mongoose from "mongoose";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const MONGO_URI =
  "mongodb+srv://latifur:gYVDe68V5pWkENQC@nilameecluster.d1zahr8.mongodb.net/?retryWrites=true&w=majority&appName=nilameeCluster";

console.log("Attempting to connect to MongoDB...");
console.log("URI:", MONGO_URI.replace(/:[^:@]+@/, ":****@")); // Hide password

mongoose
  .connect(MONGO_URI, {
    dbName: "NILAMEE_AUCTION_PLATFORM",
  })
  .then(() => {
    console.log("✅ Successfully connected to MongoDB!");
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed:");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    if (err.reason) {
      console.error("Reason:", err.reason);
    }
    process.exit(1);
  });
