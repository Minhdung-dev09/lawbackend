import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Create new order
router.post("/", createOrder);

// Get user's orders
router.get("/", getUserOrders);

// Get single order
router.get("/:id", getOrderById);

export default router; 