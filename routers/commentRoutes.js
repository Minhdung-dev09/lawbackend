import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Lấy bình luận cho một bài viết cụ thể với phân trang
router.get("/:articleId", getComments);

// Tạo bình luận mới cho một bài viết
router.post("/:articleId", protect, createComment);

// Cập nhật một bình luận cụ thể
router.put("/:commentId", protect, updateComment);

// Xóa một bình luận cụ thể
router.delete("/:commentId", protect, deleteComment);

export default router;
