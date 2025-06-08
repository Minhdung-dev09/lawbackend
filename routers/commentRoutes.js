import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { 
  createComment, 
  getComments, 
  updateComment, 
  deleteComment 
} from "../controllers/commentController.js";

const router = express.Router();

// Get comments for a specific article with pagination
router.get("/:articleId", getComments);

// Create a new comment for an article
router.post("/:articleId", protect, createComment);

// Update a specific comment
router.put("/:commentId", protect, updateComment);

// Delete a specific comment
router.delete("/:commentId", protect, deleteComment);

export default router;