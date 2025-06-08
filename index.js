import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routers/userRoutes.js";
import newsRoutes from "./routers/newsRoutes.js";
import productRoutes from "./routers/productRoutes.js";
import consultationRoutes from "./routers/consultationRoutes.js";
import commentRoutes from "./routers/commentRoutes.js";
import cartRoutes from "./routers/cartRoutes.js";
import orderRoutes from "./routers/orderRoutes.js";
import cors from "cors";

dotenv.config();
const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cấu hình CORS cho phép frontend gửi cookie
app.use(
  cors({
    origin: "http://localhost:3000" || "https://sushilaw.io.vn",  // Phải đúng địa chỉ frontend của bạn
    credentials: true,                  // Cho phép gửi cookie trong request
  })
);

app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

const port = process.env.PORT || 5001;

connectDB();

app.listen(port, () => console.log(`Server is running on port ${port}`));
