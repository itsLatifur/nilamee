import { config } from "dotenv";
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
import { endedAuctionCron } from "./features/auctions/jobs/endedAuction.job.js";
import { verifyCommissionCron } from "./features/commissions/jobs/verifyCommission.job.js";

const app = express();
config({
  path: "./config/config.env",
});

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
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);

endedAuctionCron();
verifyCommissionCron();
connection();
app.use(errorMiddleware);

export default app;
