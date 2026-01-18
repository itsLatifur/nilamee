import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve config path relative to this file so env loads regardless of cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "config", "config.env");
const dotenvResult = config({ path: envPath });

console.log("Loaded env from:", envPath, "result:", dotenvResult?.parsed ? "OK" : "NO_VARS");

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";
import userRouter from "./features/users/users.routes.js";
import auctionItemRouter from "./features/auctions/auctions.routes.js";
import bidRouter from "./features/bids/bids.routes.js";
import commissionRouter from "./features/commissions/commissions.routes.js";
import superAdminRouter from "./features/admin/admin.routes.js";
import paymentRouter from "./features/payments/payments.routes.js";
import disputeRouter from "./features/disputes/dispute.routes.js";
import feedbackRouter from "./features/feedback/feedback.routes.js";
import profileRouter from "./features/profile/profile.routes.js";
import notificationRouter from "./router/notificationRoutes.js";
import publicRouter from "./features/public/public.routes.js";
import { endedAuctionCron } from "./features/auctions/jobs/endedAuction.job.js";
import { paymentDeadlineCron } from "./features/auctions/jobs/paymentDeadline.job.js";
import { verifyCommissionCron } from "./features/commissions/jobs/verifyCommission.job.js";

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
// Alias route: support both /api/v1/auctionitem and /api/v1/auctions for frontend compatibility
app.use("/api/v1/auctions", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/dispute", disputeRouter);
app.use("/api/v1/feedback", feedbackRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/public", publicRouter);

// Connect to database first, then start cron jobs
connection()
  .then(() => {
    endedAuctionCron();
    paymentDeadlineCron();
    verifyCommissionCron();
  })
  .catch((err) => {
    console.error("Failed to initialize:", err);
  });

app.use(errorMiddleware);

export default app;
