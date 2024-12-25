import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.listen(3000, () => {
  connectDB();
  console.log(`Server is running at http://localhost:/3000`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// error handling middlewares

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,

    statusCode,
    message,
  });
});
