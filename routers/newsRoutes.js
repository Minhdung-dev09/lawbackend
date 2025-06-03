import express from "express";
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getTopViewedNews,
} from "../controllers/newsController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllNews);
router.get("/top-viewed", getTopViewedNews);
router.get("/:id", getNewsById);

// Admin only routes
router
  .route("/admin")
  .post(protect, admin, createNews);

router
  .route("/admin/:id")
  .put(protect, admin, updateNews)
  .delete(protect, admin, deleteNews);

export default router; 